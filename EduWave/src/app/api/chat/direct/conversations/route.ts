import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DirectConversation from '@/models/DirectConversation';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find all conversations where the user is a participant
    const conversations = await DirectConversation.find({
      participants: user._id
    }).populate('participants', 'full_name avatar_url role');

    const enrichedConvs = [];

    for (const conv of conversations) {
      // Find other participant
      const otherParticipant = conv.participants.find(
        (p: any) => p._id.toString() !== user._id.toString()
      );

      // Find last message
      const lastMsg = await DirectMessage.findOne({ conversation_id: conv._id })
        .sort({ created_at: -1 });

      enrichedConvs.push({
        id: conv._id.toString(),
        name: conv.name,
        is_group: conv.is_group,
        created_at: conv.created_at,
        otherUserName: otherParticipant?.full_name || 'Utilizator',
        otherUserId: otherParticipant?._id.toString() || '',
        otherUserAvatar: otherParticipant?.avatar_url || '',
        lastMessage: lastMsg?.content || 'Începe conversația...',
        lastMessageTime: lastMsg?.created_at || conv.created_at
      });
    }

    // Sort by last message time descending
    enrichedConvs.sort(
      (a: any, b: any) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    return NextResponse.json(enrichedConvs);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { participantId } = await req.json();
    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if conversation already exists between these two users
    let conversation = await DirectConversation.findOne({
      is_group: false,
      participants: { $all: [user._id, participantId] }
    });

    if (!conversation) {
      conversation = await DirectConversation.create({
        is_group: false,
        participants: [user._id, participantId]
      });
    }

    return NextResponse.json({ id: conversation._id.toString() });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
