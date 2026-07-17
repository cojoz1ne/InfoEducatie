import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { message: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const provider = existingUser.auth_provider || (existingUser.password ? 'credentials' : 'unknown');
      if (provider !== 'credentials') {
        const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'un cont social';
        return NextResponse.json(
          { message: `Acest email este deja utilizat prin autentificarea cu ${providerName}. Te rugăm să folosești acea metodă de conectare.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: 'Acest email este deja înregistrat.' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isTeacher = role === 'teacher';

    const newUser = new User({
      email,
      password: hashedPassword,
      full_name,
      role: role || 'student',
      is_approved: isTeacher ? false : true, // Teachers need approval, students auto-approve
      auth_provider: 'credentials',
    });

    await newUser.save();

    // Create JWT payload
    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role,
      }
    };

    // Sign Token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json(
      { 
        message: 'Înregistrare cu succes',
        user: newUser.toJSON(),
      },
      { status: 201 }
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
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Eroare de server. Te rugăm să încerci din nou.' },
      { status: 500 }
    );
  }
}
