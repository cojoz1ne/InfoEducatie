import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Neautentificat' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    await connectToDatabase();

    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'Utilizatorul nu a fost găsit' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (user.is_banned) {
      return NextResponse.json(
        { error: 'banned', message: 'Contul tău a fost suspendat permanent (Ban).' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (user.timeout_until && new Date(user.timeout_until) > new Date()) {
      return NextResponse.json(
        { 
          error: 'timeout', 
          message: `Contul tău este suspendat temporar (Timeout) până la data de ${new Date(user.timeout_until).toLocaleString('ro-RO')}.` 
        },
        { status: 403, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json({ user: user.toJSON() }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { message: 'Token invalid sau expirat' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
