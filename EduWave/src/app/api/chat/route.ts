import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import AIConversation from '@/models/AIConversation';
import AIMessage from '@/models/AIMessage';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

const SYSTEM_PROMPT_BASE = `Ești EduWave AI, asistentul educațional inteligent și prietenos integrat în platforma EduWave. Ești un profesor și companion de învățare dedicat elevilor și profesorilor.

Rolul tău este să îl ajuți pe utilizator CU ORICE ARE NEVOIE ÎN PROCESUL DE ÎNVĂȚARE: explică lecții și concepte din orice materie (literatură, matematică, istorie, științe etc.), rezolvă exerciții, oferă idei, rezumă texte și răspunde la orice întrebare educațională sau generală, clar și pe înțelesul utilizatorului. ÎN ACELAȘI TIMP, cunoști foarte bine platforma EduWave și poți ghida utilizatorul să o folosească (cursuri, insigne, setări, profil, chat etc.). Dacă întrebarea ține de platformă, oferă indicații concrete și pas cu pas; dacă ține de alt subiect, răspunde direct și util, fără să refuzi și fără să te limitezi la platformă.
Răspunde ÎNTOTDEAUNA în limba ROMÂNĂ. Fii extrem de politicos, cald și oferă răspunsuri detaliate, frumos structurate cu liste și emoji-uri.
IMPORTANT: Lasă un singur rând liber (o singură linie nouă \n) între paragrafele și ideile principale pentru a le separa. NU lăsa rânduri libere între elementele din liste sau sub-puncte.
Folosește EXCLUSIV formatarea standard Markdown pentru liste (de exemplu, cu minus/liniuță "- " pentru liste neordonate și "1. " pentru liste ordonate). NU scrie niciodată manual simboluri sau caractere de tip cerc ("o", "•"), pătrățele ("■") sau steluțe ca text simplu pentru punctele din listă; folosește formatul standard Markdown pentru ca interfața să le poată indenta corect.
Pune ÎNTOTDEAUNA un rând liber ÎNAINTE de orice listă (cu "- " sau "1. ") sau titlu (cu "#"), pentru ca interfața să le formateze corect.

CUNOȘTINȚE COMPLETE DESPRE PLATFORMA EDUWAVE (Cum folosește utilizatorul site-ul și ce trebuie să facă):

1. INTRODUCERE & SCOP:
- EduWave este o platformă modernă de tip LMS (Learning Management System) cu elemente avansate de gamificare (insigne, streak-uri zilnice, statistici de studiu) și asistență AI locală privată.
- Este construită pentru a face procesul de învățare interactiv, privat și extrem de eficient.

2. NAVIGAȚIE ȘI PAGINI (Ce găsește utilizatorul pe site și cum le folosește):
- Dashboard (Panoul Principal): Locul unde utilizatorul își vede progresul la cursuri, streak-ul zilnic de studiu, orele totale dedicate învățării, notele/scorurile medii obținute și insignele strânse. Utilizatorul poate da click direct pe oricare curs de aici pentru a continua studiul.
- Cursuri (Courses): Pagina cu toate cursurile disponibile (Informatică, Matematică, Fizică, Design, Afaceri). Elevul poate căuta cursuri prin bara de căutare sau filtra după categorii. Profesorul (contul cu rol 'teacher') are o filă suplimentară "Administrare" unde își poate crea cursuri noi, edita sau șterge cursurile create.
- Pagina unui Curs (Course Detail): Când elevul intră pe un curs, vede capitolele acestuia. Le poate parcurge, iar progresul lui se actualizează automat. La sfârșitul fiecărui capitol se află un Test (Quiz) cu întrebări grilă. Promovarea lui deblochează materialele următoare.
- Insigne (Badges): Pagina care afișează colecția completă de insigne (realizări). Se vede rata de completare în procente, numărul de insigne deblocate vs. cele blocate. Insignele blocate sunt afișate cu un lacăt gri. Elevul poate da click pe "Începe Cursul" direct pe o insignă blocată pentru a merge direct la cursul asociat ei și a încerca să o deblokeze.
- Profil (Profile Page): Aici elevul își vede biografia, statisticile generale și insignele. Își poate edita profilul sau își poate schimba fotografia de profil (aceasta se încarcă direct în Supabase Storage sub formă de URL public securizat).
- Setări Cont (Settings): Are 4 secțiuni: General (pentru editare Nume Complet și Biografie), Notificări (activare/deviere notificări Email și Push), Securitate (schimbarea parolei) și Confidențialitate (opțiunea de a face profilul Public sau Privat pentru ceilalți colegi). Utilizatorul trebuie să apese pe "Salvează Modificările" în dreapta-sus pentru a le aplica.
- Chat: Secțiune de mesagerie în timp real pentru comunicare directă și rapidă între elevi și profesori.
- Asistent AI (Tu!): Asistentul local privat de învățare. Îl ajută pe elev să înțeleagă lecțiile, îi explică concepte complexe și îl ghidează pe site.

3. WORKFLOWS PRACTICE (Ce trebuie să facă utilizatorul):
- Cum iau o insignă (badge)? Prin 3 modalități: terminarea unui curs (100% progres), obținerea unui scor de peste 50% la un test (quiz) dintr-un capitol sau primirea manuală a unei insigne de la un profesor pentru performanțe deosebite.
- Cum progresez la cursuri? Deschizi cursul dorit din pagina "Cursuri", citești capitolele, iar parcurgerea materialelor îți salvează automat progresul. Rezolvă testele din finalul fiecărui capitol pentru a debloca restul lecțiilor.
- Cum schimb setările sau parola? Mergi la "Setări" din meniul lateral și navighezi în tabul corespunzător (General, Securitate etc.), apoi salvezi modificările.

  Oferă mereu răspunsul structurat, curat și exclusiv în limba ROMÂNĂ, adaptat nevoilor utilizatorului.`;

const MODE_ADDONS: Record<string, string> = {
  explain: `\n\nMOD SPECIALIZAT — EXPLICĂ O LECȚIE: Când utilizatorul îți cere să explici o lecție sau un concept, oferă explicații clare, pe înțelesul unui elev, cu exemple concrete și analogii. Structurează cu titluri și liste. Nu da doar definiții seci.`,
  summarize: `\n\nMOD SPECIALIZAT — REZUMĂ TEXT: Când utilizatorul îți oferă un text, rezumă-l cât mai clar și concis, păstrând ideile principale și structura. Folosește liste cu punctele cheie.`,
  quiz: `\n\nMOD SPECIALIZAT — GENEREAZĂ QUIZ: Rolul tău este să generezi quiz-uri cu întrebări grilă pe baza subiectului indicat de utilizator. Creează întrebări cu exact 4 variante de răspuns (una singură corectă), numerotate, și la final indică răspunsurile corecte într-o secțiune clar marcată. Nu genera quizul până când utilizatorul nu specifică subiectul.`,
};

function buildSystemPrompt(mode?: string): string {
  const addon = mode ? MODE_ADDONS[mode] : undefined;
  return addon ? SYSTEM_PROMPT_BASE + addon : SYSTEM_PROMPT_BASE;
}

function normalizeMarkdown(text: string): string {
  const STD_LIST = /^([-*+]\s+|\d+[.)]\s+)/;
  const BULLET = /^[•◦▪·–—]\s+/;
  const HEADING = /^#{1,6}\s+/;

  const lines = text.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isList = STD_LIST.test(trimmed) || BULLET.test(trimmed);
    const isHeading = HEADING.test(trimmed);

    if ((isList || isHeading) && out.length > 0) {
      const prev = out[out.length - 1].trim();
      const prevIsBlock = STD_LIST.test(prev) || BULLET.test(prev) || HEADING.test(prev);
      if (prev !== '' && !prevIsBlock) {
        out.push('');
      }
    }

    const converted = BULLET.test(trimmed) ? line.replace(BULLET, '- ') : line;
    out.push(converted);
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 401 });
    }

    const userId = decoded.user.id;
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Utilizatorul nu a fost găsit" }, { status: 404 });
    }

    if (user.is_ai_blacklisted) {
      return NextResponse.json({ 
        error: 'ai_blacklisted', 
        message: 'Contul tău a fost adăugat în Blacklist-ul asistentului AI și nu poți folosi această funcționalitate.' 
      }, { status: 403 });
    }

    const body = await req.json();
    const { message, conversationId, mode, model } = body;
    console.log("[EduWave AI] Mode:", mode, "Model:", model);

    const systemPromptText = buildSystemPrompt(mode);

    const aiModelChoice: string = model || 'gemini';
    const providerOrder: string[] =
      aiModelChoice === 'openai' ? ['openai', 'ollama'] :
      aiModelChoice === 'ollama' ? ['ollama'] :
      ['gemini', 'openai', 'ollama'];
    const providerEnabled = (p: string) => providerOrder.includes(p);

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Create/Find Conversation
    let currentConvId = conversationId;
    if (!currentConvId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      const newConv = await AIConversation.create({
        user_id: userId,
        title: title
      });
      currentConvId = newConv._id.toString();
    }

    // 2. Save User Message
    await AIMessage.create({
      conversation_id: currentConvId,
      role: 'user',
      content: message
    });

    // 3. Load message history for context
    const dbMessages = await AIMessage.find({ conversation_id: currentConvId })
      .sort({ created_at: 1 })
      .limit(30);

    let aiReplyText = '';

    // ==========================================
    // A. CLOUD MODE CHECK: Google Gemini API (Lightning Fast & Free Tier)
    // ==========================================
    const geminiKey = process.env.GEMINI_API_KEY;
    console.log("[EduWave AI] Checking Gemini API Key... Status:", geminiKey ? `Loaded (starts with ${geminiKey.substring(0, 6)}...)` : "Not loaded");
    
    if (providerEnabled('gemini') && geminiKey && geminiKey !== 'your-gemini-key' && geminiKey !== '') {
      const contents: any[] = [];

      dbMessages.forEach((msg: any) => {
        if (msg.content && !msg.content.startsWith('Eroare:') && !msg.content.includes('EduWave AI. Cu ce te pot ajuta astăzi?')) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      });

      // Filter contents to ensure roles STRICTLY alternate (user, model, user, model)
      const cleanContents: any[] = [];
      contents.forEach(item => {
        if (cleanContents.length === 0) {
          if (item.role === 'user') {
            cleanContents.push(item);
          }
        } else {
          const lastItem = cleanContents[cleanContents.length - 1];
          if (lastItem.role !== item.role) {
            cleanContents.push(item);
          }
        }
      });

      if (cleanContents.length === 0) {
        cleanContents.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      console.log("[EduWave AI] Sending request to Gemini API...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: cleanContents,
            systemInstruction: {
              parts: [{ text: systemPromptText }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResponse) {
          aiReplyText = aiResponse;
          console.log("[EduWave AI] Successfully got reply from Gemini!");
        }
      } else {
        const errText = await response.text();
        console.warn("[EduWave AI] Gemini API failed. Details:", errText);
      }
    }

    // ==========================================
    // B. CLOUD MODE CHECK: OpenAI API
    // ==========================================
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!aiReplyText && providerEnabled('openai') && openaiKey && openaiKey !== 'your-openai-key' && openaiKey !== '') {
      const messages = [
        { role: 'system', content: systemPromptText }
      ];

      dbMessages.forEach((msg: any) => {
        if (msg.content && !msg.content.startsWith('Eroare:') && !msg.content.includes('EduWave AI. Cu ce te pot ajuta astăzi?')) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;
        if (aiResponse) {
          aiReplyText = aiResponse;
        }
      } else {
        console.error("OpenAI API Error details:", await response.text());
      }
    }

    // ==========================================
    // C. FALLBACK MODE: Ollama (local LLM server)
    // ==========================================
    if (!aiReplyText && providerEnabled('ollama')) {
      const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
      const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

      const messages: any[] = [{ role: 'system', content: systemPromptText }];

      dbMessages.forEach((msg: any) => {
        if (msg.content && !msg.content.startsWith('Eroare:') && !msg.content.includes('EduWave AI. Cu ce te pot ajuta astăzi?')) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });

      if (messages[messages.length - 1]?.role !== 'user') {
        messages.push({ role: 'user', content: message });
      }

      try {
        const response = await fetch(`${ollamaHost}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages,
            stream: false,
            options: { temperature: 0.7 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data?.message?.content;
          if (aiResponse) {
            aiReplyText = aiResponse;
            console.log("[EduWave AI] Successfully got reply from Ollama!");
          }
        } else {
          console.error("Ollama API Error:", await response.text());
        }
      } catch (err) {
        console.error("Ollama request failed:", err);
      }
    }

    if (!aiReplyText) {
      aiReplyText = "Eroare: Nu s-a putut obține un răspuns de la asistentul AI.";
    }

    aiReplyText = normalizeMarkdown(aiReplyText);

    // 4. Save AI Reply
    await AIMessage.create({
      conversation_id: currentConvId,
      role: 'assistant',
      content: aiReplyText
    });

    return NextResponse.json({ reply: aiReplyText, conversationId: currentConvId });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({
      error: error.message || "An error occurred while communicating with the AI."
    }, { status: 500 });
  }
}
