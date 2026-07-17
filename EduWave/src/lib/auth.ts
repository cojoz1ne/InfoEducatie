import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await connectToDatabase();
    
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) return null;

    // Check if banned or timed out
    if (user.is_banned) return null;
    if (user.timeout_until && new Date(user.timeout_until) > new Date()) return null;

    return user;
  } catch (err) {
    return null;
  }
}
