import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, score, total, percentage } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const attempt = new QuizAttempt({
      user_id: user._id,
      course_id: courseId,
      item_id: itemId,
      score: score || 0,
      total: total || 0,
      percentage: percentage || 0
    });

    await attempt.save();
    return NextResponse.json(attempt.toJSON(), { status: 201 });
  } catch (error: any) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    await connectToDatabase();
    const attempts = await QuizAttempt.find({ course_id: courseId });

    const started = new Set<string>();
    const finished = new Set<string>();
    attempts.forEach((a: any) => {
      const uid = a.user_id.toString();
      started.add(uid);
      if ((a.percentage ?? 0) >= 50) finished.add(uid);
    });

    return NextResponse.json({
      started: started.size,
      finished: finished.size,
      totalAttempts: attempts.length
    });
  } catch (error: any) {
    console.error('Error fetching quiz attempt stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
