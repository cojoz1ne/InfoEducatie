import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, avatar_url, bio, email_notifications, push_notifications, public_profile, password } = await req.json();
    await connectToDatabase();

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update fields if provided
    if (full_name !== undefined) dbUser.full_name = full_name;
    if (avatar_url !== undefined) dbUser.avatar_url = avatar_url;
    if (bio !== undefined) dbUser.bio = bio;
    if (email_notifications !== undefined) dbUser.email_notifications = email_notifications;
    if (push_notifications !== undefined) dbUser.push_notifications = push_notifications;
    if (public_profile !== undefined) dbUser.public_profile = public_profile;

    let passwordChanged = false;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      dbUser.password = await bcrypt.hash(password, salt);
      passwordChanged = true;
    }

    await dbUser.save();

    if (passwordChanged) {
      await Notification.create({
        user_id: dbUser._id,
        title: 'Securitate cont',
        content: 'Parola ta a fost actualizată cu succes.',
        type: 'password',
        is_read: false
      });
    }

    return NextResponse.json(dbUser.toJSON());
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
