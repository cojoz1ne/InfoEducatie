import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

import LessonProgress from '@/models/LessonProgress';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ createdAt: -1 });

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(courses.map(c => c.toJSON()));
    }

    // Fetch all lesson progress for this user
    const progressList = await LessonProgress.find({ user_id: user._id });
    const completedMap = new Map<string, Set<string>>();
    progressList.forEach((p: any) => {
      const cId = p.course_id.toString();
      if (!completedMap.has(cId)) {
        completedMap.set(cId, new Set());
      }
      completedMap.get(cId)!.add(p.item_id);
    });

    const coursesWithProgress = courses.map(course => {
      const courseJSON = course.toJSON();
      
      let totalItems = 0;
      if (courseJSON.chapters) {
        courseJSON.chapters.forEach((ch: any) => {
          if (ch.items) totalItems += ch.items.length;
        });
      }

      const completedSet = completedMap.get(courseJSON.id) || new Set();
      courseJSON.progress = totalItems > 0 
        ? Math.min(Math.round((completedSet.size / totalItems) * 100), 100)
        : 0;

      return courseJSON;
    });

    return NextResponse.json(coursesWithProgress);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, image_url } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Titlul este obligatoriu.' }, { status: 400 });
    }

    await connectToDatabase();
    const newCourse = new Course({
      title,
      description,
      category: category || 'Informatică',
      image_url: image_url || '',
      teacher_id: user._id,
      teacher_name: user.full_name || 'Profesor',
      chapters: []
    });

    await newCourse.save();
    return NextResponse.json(newCourse.toJSON(), { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
