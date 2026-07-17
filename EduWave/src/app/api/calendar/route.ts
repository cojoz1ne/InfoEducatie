import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CalendarEvent from '@/models/CalendarEvent';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const events = await CalendarEvent.find({ user_id: user._id }).sort({ date: 1, start_time: 1 });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, date, start_time, end_time, type, color } = await req.json();
    if (!title || !date || !start_time || !end_time || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    const newEvent = new CalendarEvent({
      user_id: user._id,
      title,
      description,
      date,
      start_time,
      end_time,
      type,
      color: color || '#1e6fd9'
    });

    await newEvent.save();
    return NextResponse.json(newEvent.toJSON());
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, description, date, start_time, end_time, type, color } = await req.json();
    if (!id || !title || !date || !start_time || !end_time || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedEvent = await CalendarEvent.findOneAndUpdate(
      { _id: id, user_id: user._id },
      { title, description, date, start_time, end_time, type, color },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent.toJSON());
  } catch (error: any) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const deletedEvent = await CalendarEvent.findOneAndDelete({ _id: id, user_id: user._id });
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
