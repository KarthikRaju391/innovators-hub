import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../src/lib/db';
import { users } from '../../../src/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; ${options.maxAge ? `Max-Age=${options.maxAge};` : ''} ${options.httpOnly ? 'HttpOnly;' : ''} ${options.sameSite ? `SameSite=${options.sameSite};` : ''}`);
        },
        remove(name: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { name, bio, githubUrl, twitterUrl, websiteUrl, linkedinUrl } = req.body;

    try {
      const updatedUser = await db
        .update(users)
        .set({
          name,
          bio,
          githubUrl,
          twitterUrl,
          websiteUrl,
          linkedinUrl,
        })
        .where(eq(users.id, session.user.id))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser[0]);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
