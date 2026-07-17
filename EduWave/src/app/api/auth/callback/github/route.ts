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

    // Exchange code for GitHub token
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || '',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
        code,
        redirect_uri: `${origin}/api/auth/callback/github`,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('GitHub token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=OAuthTokenExchangeFailed', req.url));
    }

    // Get user info from GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'EduWave-App',
      },
    });
    const githubUser = await userRes.json();

    let email = githubUser.email;

    // If email is not public, fetch user emails
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'EduWave-App',
        },
      });
      const emails = await emailsRes.json();
      if (Array.isArray(emails)) {
        const primaryEmailObj = emails.find((e: any) => e.primary) || emails[0];
        email = primaryEmailObj?.email;
      }
    }

    if (!email) {
      console.error('GitHub user profile missing email:', githubUser);
      return NextResponse.redirect(new URL('/login?error=OAuthEmailMissing', req.url));
    }

    await connectToDatabase();

    let user = await User.findOne({ email });

    if (user) {
      const provider = user.auth_provider || (user.password ? 'credentials' : 'github');
      if (provider !== 'github') {
        return NextResponse.redirect(new URL('/login?error=EmailUsedInOtherMethod', req.url));
      }
      
      // Update avatar if not present or different
      if (githubUser.avatar_url && user.avatar_url !== githubUser.avatar_url) {
        user.avatar_url = githubUser.avatar_url;
        await user.save();
      }
    } else {
      user = await User.create({
        email,
        full_name: githubUser.name || githubUser.login || email.split('@')[0],
        avatar_url: githubUser.avatar_url || '',
        role: 'student',
        is_approved: true,
        auth_provider: 'github',
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
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=OAuthInternalError', req.url));
  }
}
