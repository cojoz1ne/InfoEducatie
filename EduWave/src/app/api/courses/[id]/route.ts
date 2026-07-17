import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Cursul nu a fost găsit.' }, { status: 404 });
    }
    return NextResponse.json(course.toJSON());
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Cursul nu a fost găsit.' }, { status: 404 });
    }

    // Verify ownership
    if (user.role === 'teacher' && course.teacher_id.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Nu ești profesorul acestui curs.' }, { status: 403 });
    }

    // Update fields if provided
    if (body.title !== undefined) course.title = body.title;
    if (body.description !== undefined) course.description = body.description;
    if (body.category !== undefined) course.category = body.category;
    if (body.image_url !== undefined) course.image_url = body.image_url;
    if (body.chapters !== undefined) course.chapters = body.chapters;

    await course.save();

    return NextResponse.json(course.toJSON());
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Cursul nu a fost găsit.' }, { status: 404 });
    }

    // Verify ownership
    if (user.role === 'teacher' && course.teacher_id.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Nu ești profesorul acestui curs.' }, { status: 403 });
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Cursul a fost șters cu succes.' });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
