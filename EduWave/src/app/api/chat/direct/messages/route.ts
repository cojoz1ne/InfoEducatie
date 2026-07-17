import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DirectConversation from '@/models/DirectConversation';
import DirectMessage from '@/models/DirectMessage';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Verify user is participant in this conversation
    const conversation = await DirectConversation.findOne({
      _id: conversationId,
      participants: user._id
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 403 });
    }

    const messages = await DirectMessage.find({ conversation_id: conversationId })
      .sort({ created_at: 1 });

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      conversation_id: msg.conversation_id.toString(),
      sender_id: msg.sender_id.toString(),
      content: msg.content,
      created_at: msg.created_at,
      file_url: msg.file_url,
      file_name: msg.file_name,
      file_type: msg.file_type,
      waveform: msg.waveform
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.mute_until && new Date(user.mute_until) > new Date()) {
      return NextResponse.json({ 
        error: 'muted', 
        message: `Nu poți trimite mesaje deoarece ești sub restricție (Mute) până la data de ${new Date(user.mute_until).toLocaleString('ro-RO')}.` 
      }, { status: 403 });
    }

    const { conversationId, content, fileUrl, fileName, fileType, waveform } = await req.json();
    if (!conversationId || (!content && !fileUrl)) {
      return NextResponse.json({ error: 'conversationId and either content or fileUrl are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Verify user is participant in this conversation
    const conversation = await DirectConversation.findOne({
      _id: conversationId,
      participants: user._id
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 403 });
    }

    const message = await DirectMessage.create({
      conversation_id: conversationId,
      sender_id: user._id,
      content: content || '',
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      waveform: waveform
    });

    return NextResponse.json({
      id: message._id.toString(),
      conversation_id: message.conversation_id.toString(),
      sender_id: message.sender_id.toString(),
      content: message.content,
      created_at: message.created_at,
      file_url: message.file_url,
      file_name: message.file_name,
      file_type: message.file_type,
      waveform: message.waveform
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
