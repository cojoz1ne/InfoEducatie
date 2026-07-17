import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CourseRating from '@/models/CourseRating';
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
      return NextResponse.json({ rating: null });
    }

    await connectToDatabase();
    const userRating = await CourseRating.findOne({ user_id: user._id, course_id: courseId });
    
    return NextResponse.json({ rating: userRating ? userRating.rating : null });
  } catch (error: any) {
    console.error('Error fetching rating:', error);
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

    const { rating } = await req.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating invalid. Trebuie să fie între 1 și 5.' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedRating = await CourseRating.findOneAndUpdate(
      { user_id: user._id, course_id: courseId },
      { user_id: user._id, course_id: courseId, rating },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedRating.toJSON());
  } catch (error: any) {
    console.error('Error saving rating:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
