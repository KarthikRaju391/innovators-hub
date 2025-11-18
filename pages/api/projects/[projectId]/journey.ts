import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../src/lib/db';
import { journeyPosts, projects } from '../../../../src/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db
        .select()
        .from(journeyPosts)
        .where(eq(journeyPosts.projectId, projectId))
        .orderBy(desc(journeyPosts.createdAt));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching journey posts:', error);
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
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Verify user owns the project
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (project.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project[0].creatorId !== user.id) {
        return res.status(403).json({ message: 'You do not have permission to add journey posts to this project' });
      }

      const { content, isPublic } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const newPost = await db
        .insert(journeyPosts)
        .values({
          id: uuidv7(),
          content: content.trim(),
          projectId,
          creatorId: user.id,
          isPublic: isPublic !== undefined ? isPublic : true,
        })
        .returning();

      res.status(201).json(newPost[0]);
    } catch (error) {
      console.error('Error creating journey post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
