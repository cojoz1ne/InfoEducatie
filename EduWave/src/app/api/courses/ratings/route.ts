import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CourseRating from '@/models/CourseRating';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const ratings = await CourseRating.find({});
    const ratingsMap: Record<string, { sum: number; count: number }> = {};
    ratings.forEach((r: any) => {
      const courseId = r.course_id.toString();
      if (!ratingsMap[courseId]) ratingsMap[courseId] = { sum: 0, count: 0 };
      ratingsMap[courseId].sum += r.rating;
      ratingsMap[courseId].count += 1;
    });

    const avgMap: Record<string, { avg: number; count: number }> = {};
    Object.entries(ratingsMap).forEach(([cid, val]) => {
      avgMap[cid] = { avg: Math.round((val.sum / val.count) * 10) / 10, count: val.count };
    });

    return NextResponse.json(avgMap);
  } catch (error: any) {
    console.error('Error fetching course ratings map:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
