import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Emailul și parola sunt obligatorii.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    const provider = user.auth_provider || (user.password ? 'credentials' : 'unknown');
    if (provider !== 'credentials') {
      const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'alt cont social';
      return NextResponse.json(
        { message: `Acest email este asociat cu un cont înregistrat prin ${providerName}. Te rugăm să te conectezi folosind acea metodă.` },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password || '');

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    if (user.is_banned) {
      return NextResponse.json(
        { message: 'Contul tău a fost suspendat permanent (Ban).' },
        { status: 403 }
      );
    }

    if (user.timeout_until && new Date(user.timeout_until) > new Date()) {
      return NextResponse.json(
        { message: `Contul tău este suspendat temporar (Timeout) până la data de ${new Date(user.timeout_until).toLocaleString('ro-RO')}.` },
        { status: 403 }
      );
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json(
      { 
        message: 'Conectare reușită',
        user: user.toJSON(),
      },
      { status: 200 }
    );
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Eroare de server. Te rugăm să încerci din nou.' },
      { status: 500 }
    );
  }
}
