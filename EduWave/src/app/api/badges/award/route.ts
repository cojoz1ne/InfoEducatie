import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserBadge from '@/models/UserBadge';
import Badge from '@/models/Badge';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { badgeId } = await req.json();
    if (!badgeId) {
      return NextResponse.json({ error: 'badgeId is required.' }, { status: 400 });
    }

    await connectToDatabase();
    // Verify badge exists
    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return NextResponse.json({ error: 'Insigna nu a fost găsită.' }, { status: 404 });
    }

    // Award badge (using findOneAndUpdate with upsert to avoid duplicate errors)
    await UserBadge.findOneAndUpdate(
      { user_id: user._id, badge_id: badgeId },
      { user_id: user._id, badge_id: badgeId, earned_at: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Insignă acordată!' });
  } catch (error: any) {
    console.error('Error awarding badge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
