import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import AIConversation from '@/models/AIConversation';
import AIMessage from '@/models/AIMessage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
    }

    const conv = await AIConversation.findOne({ _id: conversationId, user_id: userId });
    if (!conv) {
      return NextResponse.json({ error: "Conversația nu a fost găsită sau nu îți aparține" }, { status: 404 });
    }

    const messages = await AIMessage.find({ conversation_id: conversationId })
      .sort({ created_at: 1 });

    const formattedMessages = messages.map(msg => msg.toJSON());

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: error.message || "Eroare la preluarea mesajelor" }, { status: 500 });
  }
}
