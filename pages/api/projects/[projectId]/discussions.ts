import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../src/lib/db';
import { discussions, users } from '../../../../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db
        .select({
          id: discussions.id,
          title: discussions.title,
          content: discussions.content,
          upvotes: discussions.upvotes,
          createdAt: discussions.createdAt,
          updatedAt: discussions.updatedAt,
          author: {
            id: users.id,
            name: users.name,
            avatar: users.avatar,
          },
        })
        .from(discussions)
        .leftJoin(users, eq(discussions.authorId, users.id))
        .where(eq(discussions.projectId, projectId))
        .orderBy(desc(discussions.upvotes), desc(discussions.createdAt));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching discussions:', error);
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
        return res.status(401).json({ message: 'Please log in to start a discussion' });
      }

      const { title, content } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const newDiscussion = await db
        .insert(discussions)
        .values({
          id: uuidv7(),
          title: title.trim(),
          content: content.trim(),
          projectId,
          authorId: user.id,
        })
        .returning();

      res.status(201).json(newDiscussion[0]);
    } catch (error) {
      console.error('Error creating discussion:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
