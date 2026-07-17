import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Badge from '@/models/Badge';
import UserBadge from '@/models/UserBadge';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser();

    // 1. Fetch all badges
    const badges = await Badge.find({}).lean();
    
    // 2. Fetch all courses to map titles
    const courses = await Course.find({}, 'title').lean();
    const coursesMap = new Map(courses.map(c => [c._id.toString(), c.title]));

    // 3. Fetch user badges if user logged in
    let earnedBadgeIds: string[] = [];
    if (user) {
      const earned = await UserBadge.find({ user_id: user._id });
      earnedBadgeIds = earned.map(eb => eb.badge_id);
    }

    // 4. Assemble
    const assembled = badges.map((badge: any) => ({
      ...badge,
      id: badge._id,
      courses: badge.course_id ? { title: coursesMap.get(badge.course_id.toString()) || 'Curs general' } : null
    }));

    return NextResponse.json({
      badges: assembled,
      earnedBadgeIds
    });
  } catch (error: any) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, course_id, title, description, icon, color, badge_type, quiz_item_id, image_url } = body;

    if (!id || !course_id || !title) {
      return NextResponse.json({ error: 'id, course_id, and title are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const badge = await Badge.findOneAndUpdate(
      { _id: id },
      {
        _id: id,
        course_id,
        title,
        description: description || '',
        icon: icon || '🏆',
        color: color || '#fbbf24',
        badge_type: badge_type || 'course_complete',
        quiz_item_id: quiz_item_id || '',
        image_url: image_url || ''
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(badge.toJSON());
  } catch (error: any) {
    console.error('Error saving badge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id parameter is required.' }, { status: 400 });
    }

    await connectToDatabase();
    await Badge.findOneAndDelete({ _id: id });
    await UserBadge.deleteMany({ badge_id: id });

    return NextResponse.json({ success: true, message: 'Insignă ștearsă.' });
  } catch (error: any) {
    console.error('Error deleting badge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
