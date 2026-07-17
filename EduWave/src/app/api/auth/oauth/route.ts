import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider');
    const origin = new URL(req.url).origin;

    if (!provider) {
      return NextResponse.json({ message: 'Provider is required' }, { status: 400 });
    }

    if (provider === 'google') {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        redirect_uri: `${origin}/api/auth/callback/google`,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
      };
      const qs = new URLSearchParams(options);
      return NextResponse.json({ url: `${rootUrl}?${qs.toString()}` });
    }

    if (provider === 'github') {
      const rootUrl = 'https://github.com/login/oauth/authorize';
      const options = {
        client_id: process.env.GITHUB_CLIENT_ID || '',
        redirect_uri: `${origin}/api/auth/callback/github`,
        scope: 'read:user user:email',
        prompt: 'select_account',
      };
      const qs = new URLSearchParams(options);
      return NextResponse.json({ url: `${rootUrl}?${qs.toString()}` });
    }

    return NextResponse.json({ message: 'Invalid provider' }, { status: 400 });
  } catch (error: any) {
    console.error('OAuth redirect error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
