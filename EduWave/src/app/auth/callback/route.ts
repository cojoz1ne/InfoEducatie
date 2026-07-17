import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;

      const sbUser = data?.user;
      if (sbUser && sbUser.email) {
        await connectToDatabase();

        let user = await User.findOne({ email: sbUser.email });

        if (!user) {
          user = await User.create({
            email: sbUser.email,
            full_name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
            avatar_url: sbUser.user_metadata?.avatar_url || '',
            role: 'student',
            is_approved: true
          });
        }

        const payload = {
          user: {
            id: user.id,
            role: user.role,
          }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        const response = NextResponse.redirect(new URL('/dashboard', request.url));

        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return response;
      }
    } catch (err) {
      console.error('OAuth callback processing error:', err);
    }
  }

  // Redirect to login with error parameter if something went wrong
  return NextResponse.redirect(new URL('/login?error=OAuthFailed', request.url));
}
