import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../src/lib/db';
import { comments } from '../../../../src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { commentId } = req.query;

  if (!commentId || typeof commentId !== 'string') {
    return res.status(400).json({ message: 'Comment ID is required' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ message: 'Unauthorized - please log in to upvote' });
    }

    const updatedComment = await db
      .update(comments)
      .set({
        upvotes: sql`${comments.upvotes} + 1`,
      })
      .where(eq(comments.id, commentId))
      .returning();

    if (updatedComment.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ 
      message: 'Upvoted successfully',
      upvotes: updatedComment[0].upvotes 
    });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
