import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import LessonProgress from '@/models/LessonProgress';
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
    const enrollment = await Enrollment.findOne({ user_id: user._id, course_id: courseId });
    let hasPastProgress = false;

    if (!enrollment) {
      const progressCount = await LessonProgress.countDocuments({ user_id: user._id, course_id: courseId });
      hasPastProgress = progressCount > 0;
    }

    return NextResponse.json({
      isEnrolled: !!enrollment,
      hasPastProgress
    });
  } catch (error: any) {
    console.error('Error checking enrollment:', error);
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

    await connectToDatabase();
    // Use upsert to avoid duplicate enrollment errors
    await Enrollment.findOneAndUpdate(
      { user_id: user._id, course_id: courseId },
      { user_id: user._id, course_id: courseId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Înscris cu succes.' });
  } catch (error: any) {
    console.error('Error enrolling:', error);
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
    await Enrollment.findOneAndDelete({ user_id: user._id, course_id: courseId });

    return NextResponse.json({ success: true, message: 'Dezabonat cu succes.' });
  } catch (error: any) {
    console.error('Error unenrolling:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
