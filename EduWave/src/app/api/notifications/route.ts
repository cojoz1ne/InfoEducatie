import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const notifications = await Notification.find({ user_id: user._id })
      .sort({ created_at: -1 })
      .limit(30)
      .lean();

    const formatted = notifications.map((n: any) => ({
      id: n._id.toString(),
      title: n.title,
      content: n.content,
      type: n.type,
      is_read: n.is_read,
      created_at: n.created_at,
    }));

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    return NextResponse.json({ notifications: formatted, unreadCount });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — mark notifications as read
export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { notificationId, markAll } = await req.json();

    if (markAll) {
      await Notification.updateMany(
        { user_id: user._id, is_read: false },
        { $set: { is_read: true } }
      );
    } else if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, user_id: user._id },
        { $set: { is_read: true } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
