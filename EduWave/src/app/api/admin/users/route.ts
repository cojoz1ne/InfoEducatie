import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch all users (admin only)
export async function GET(request: Request) {
  const admin = await getAuthUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get('role');
  const approvedFilter = searchParams.get('approved');
  const search = searchParams.get('search');

  await connectToDatabase();

  const filter: any = {};

  if (roleFilter && roleFilter !== 'all') {
    filter.role = roleFilter;
  }

  if (approvedFilter === 'false') {
    filter.is_approved = false;
  } else if (approvedFilter === 'true') {
    filter.is_approved = true;
  } else if (roleFilter === 'teacher') {
    filter.is_approved = false;
  }

  if (search) {
    filter.$or = [
      { full_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const users = await User.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ users: users.map(u => u.toJSON()) });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Update user role or approval status (admin only)
export async function PATCH(request: Request) {
  const admin = await getAuthUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { userId, action, newRole, durationMinutes } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
  }

  await connectToDatabase();
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Security check: cannot restrict administrators
  if (targetUser.role === 'admin' && action !== 'change_role') {
    return NextResponse.json({ error: 'Nu poți aplica restricții unui administrator.' }, { status: 403 });
  }

  let updateData: any = {};
  let notificationTitle = '';
  let notificationContent = '';

  switch (action) {
    case 'approve':
      updateData = { is_approved: true };
      notificationTitle = 'Cont Aprobat! ✅';
      notificationContent = 'Contul tău de profesor a fost aprobat de un administrator. Acum ai acces complet la platformă!';
      break;

    case 'reject':
      updateData = { is_approved: false, role: 'student' };
      notificationTitle = 'Cerere Respinsă';
      notificationContent = 'Cererea ta pentru cont de profesor a fost respinsă. Contul tău a fost setat ca elev.';
      break;

    case 'change_role':
      if (!newRole || !['student', 'teacher', 'admin'].includes(newRole)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateData = { 
        role: newRole,
        is_approved: newRole === 'teacher' ? targetUser.is_approved : true
      };
      notificationTitle = 'Rol Actualizat';
      notificationContent = `Rolul tău a fost schimbat la: ${newRole === 'admin' ? 'Administrator' : newRole === 'teacher' ? 'Profesor' : 'Elev'}`;
      break;

    case 'ban':
      updateData = { is_banned: true };
      notificationTitle = 'Cont Suspendat (Ban)';
      notificationContent = 'Contul tău a fost suspendat permanent de către un administrator.';
      break;

    case 'unban':
      updateData = { is_banned: false };
      notificationTitle = 'Suspendare Ridicată';
      notificationContent = 'Suspendarea permanentă a contului tău a fost ridicată de către un administrator.';
      break;

    case 'timeout':
      const timeoutDuration = durationMinutes ? parseInt(durationMinutes) : 60;
      const timeoutDate = new Date(Date.now() + timeoutDuration * 60000);
      updateData = { timeout_until: timeoutDate };
      notificationTitle = 'Restricție Temporară (Timeout)';
      notificationContent = `Contul tău a primit restricție temporară de acces (Timeout) până la data de ${timeoutDate.toLocaleString('ro-RO')}.`;
      break;

    case 'untimeout':
      updateData = { timeout_until: null };
      notificationTitle = 'Timeout Ridicat';
      notificationContent = 'Restricția de tip timeout a fost ridicată de un administrator.';
      break;

    case 'mute':
      const muteDuration = durationMinutes ? parseInt(durationMinutes) : 60;
      const muteDate = new Date(Date.now() + muteDuration * 60000);
      updateData = { mute_until: muteDate };
      notificationTitle = 'Restricție Scriere (Mute)';
      notificationContent = `Ți-a fost interzisă trimiterea mesajelor pe chat (Mute) până la data de ${muteDate.toLocaleString('ro-RO')}.`;
      break;

    case 'unmute':
      updateData = { mute_until: null };
      notificationTitle = 'Mute Ridicat';
      notificationContent = 'Restricția de tip mute a fost ridicată de un administrator.';
      break;

    case 'ai_blacklist':
      updateData = { is_ai_blacklisted: true };
      notificationTitle = 'Blocat de la Asistentul AI';
      notificationContent = 'Accesul tău la asistentul AI (Chatbot) a fost blocat de către un administrator.';
      break;

    case 'remove_ai_blacklist':
      updateData = { is_ai_blacklisted: false };
      notificationTitle = 'Acces Restabilit la Asistentul AI';
      notificationContent = 'Accesul tău la asistentul AI (Chatbot) a fost restabilit.';
      break;

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    // Send notification
    try {
      const notification = new Notification({
        user_id: userId,
        title: notificationTitle,
        content: notificationContent,
        type: 'system',
        is_read: false
      });
      await notification.save();
    } catch (e) {
      console.error('Failed to send notification:', e);
    }

    return NextResponse.json({ success: true, updated: updatedUser ? updatedUser.toJSON() : null });
  } catch (error: any) {
    console.error('Action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
