import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LessonProgress from '@/models/LessonProgress';
import QuizAttempt from '@/models/QuizAttempt';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const progressList = await LessonProgress.find({ user_id: user._id, course_id: courseId });
    const completedItemIds = progressList.map(p => p.item_id);

    return NextResponse.json({ completedItemIds });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const { chapterId, itemId } = await req.json();
    if (!chapterId || !itemId) {
      return NextResponse.json({ error: 'chapterId and itemId are required.' }, { status: 400 });
    }

    await connectToDatabase();
    // Use findOneAndUpdate with upsert to avoid duplicate errors
    await LessonProgress.findOneAndUpdate(
      { user_id: user._id, item_id: itemId },
      {
        user_id: user._id,
        course_id: courseId,
        chapter_id: chapterId,
        item_id: itemId,
        completed_at: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Progres salvat.' });
  } catch (error: any) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Delete lesson progress
    await LessonProgress.deleteMany({ user_id: user._id, course_id: courseId });
    // Delete quiz attempts
    await QuizAttempt.deleteMany({ user_id: user._id, course_id: courseId });

    return NextResponse.json({ success: true, message: 'Progres resetat.' });
  } catch (error: any) {
    console.error('Error deleting progress:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
