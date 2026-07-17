import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=OAuthNoCode', req.url));
    }

    // Exchange code for Google tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${origin}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=OAuthTokenExchangeFailed', req.url));
    }

    // Get user info from Google
    const userInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`;
    const userInfoRes = await fetch(userInfoUrl);
    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      console.error('Google user profile error:', googleUser);
      return NextResponse.redirect(new URL('/login?error=OAuthProfileFetchFailed', req.url));
    }

    await connectToDatabase();

    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      const provider = user.auth_provider || (user.password ? 'credentials' : 'google');
      if (provider !== 'google') {
        return NextResponse.redirect(new URL('/login?error=EmailUsedInOtherMethod', req.url));
      }
      
      // Update avatar if not present or different
      if (googleUser.picture && user.avatar_url !== googleUser.picture) {
        user.avatar_url = googleUser.picture;
        await user.save();
      }
    } else {
      user = await User.create({
        email: googleUser.email,
        full_name: googleUser.name || googleUser.email.split('@')[0],
        avatar_url: googleUser.picture || '',
        role: 'student',
        is_approved: true,
        auth_provider: 'google',
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.redirect(new URL('/dashboard', req.url));

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=OAuthInternalError', req.url));
  }
}
