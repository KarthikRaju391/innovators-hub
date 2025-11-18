import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../../src/lib/db';
import { journeyPosts, projects } from '../../../../../src/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId, postId } = req.query;

  if (!projectId || typeof projectId !== 'string' || !postId || typeof postId !== 'string') {
    return res.status(400).json({ message: 'Project ID and Post ID are required' });
  }

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
    return res.status(403).json({ message: 'You do not have permission to modify this project' });
  }

  if (req.method === 'PUT') {
    try {
      const { content, isPublic } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const updatedPost = await db
        .update(journeyPosts)
        .set({
          content: content.trim(),
          isPublic: isPublic !== undefined ? isPublic : true,
          updatedAt: new Date(),
        })
        .where(and(eq(journeyPosts.id, postId), eq(journeyPosts.projectId, projectId)))
        .returning();

      if (updatedPost.length === 0) {
        return res.status(404).json({ message: 'Journey post not found' });
      }

      res.status(200).json(updatedPost[0]);
    } catch (error) {
      console.error('Error updating journey post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedPost = await db
        .delete(journeyPosts)
        .where(and(eq(journeyPosts.id, postId), eq(journeyPosts.projectId, projectId)))
        .returning();

      if (deletedPost.length === 0) {
        return res.status(404).json({ message: 'Journey post not found' });
      }

      res.status(200).json({ message: 'Journey post deleted successfully' });
    } catch (error) {
      console.error('Error deleting journey post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
