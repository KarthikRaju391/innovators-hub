import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../src/lib/db';
import { comments, users } from '../../../../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { discussionId } = req.query;

  if (!discussionId || typeof discussionId !== 'string') {
    return res.status(400).json({ message: 'Discussion ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db
        .select({
          id: comments.id,
          content: comments.content,
          upvotes: comments.upvotes,
          parentId: comments.parentId,
          createdAt: comments.createdAt,
          author: {
            id: users.id,
            name: users.name,
            avatar: users.avatar,
          },
        })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.discussionId, discussionId))
        .orderBy(desc(comments.createdAt));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
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
        return res.status(401).json({ message: 'Please log in to comment' });
      }

      const { content, parentId } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      const newComment = await db
        .insert(comments)
        .values({
          id: uuidv7(),
          content: content.trim(),
          discussionId,
          authorId: user.id,
          parentId: parentId || null,
        })
        .returning();

      res.status(201).json(newComment[0]);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
