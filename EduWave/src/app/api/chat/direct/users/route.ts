import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch all approved users except current user
    const users = await User.find({
      _id: { $ne: user._id }
    }).select('full_name avatar_url role');

    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      full_name: u.full_name,
      role: u.role,
      avatar_url: u.avatar_url
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
