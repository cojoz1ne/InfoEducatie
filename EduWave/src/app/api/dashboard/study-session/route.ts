import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import StudySession from '@/models/StudySession';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const session = new StudySession({
      user_id: user._id,
      start_time: new Date()
    });

    await session.save();
    return NextResponse.json(session.toJSON());
  } catch (error: any) {
    console.error('Error starting study session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, duration } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const session = await StudySession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.end_time = new Date();
    session.duration_minutes = duration || 0;

    await session.save();
    return NextResponse.json(session.toJSON());
  } catch (error: any) {
    console.error('Error ending study session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
