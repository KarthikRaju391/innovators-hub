import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../../src/lib/db';
import { projects, users } from '../../../../src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
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

    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment upvote count
    // Note: In a production app, you'd want to track which users upvoted
    // to prevent duplicate upvotes. For now, we'll just increment.
    const updatedProject = await db
      .update(projects)
      .set({
        upvotes: sql`${projects.upvotes} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    res.status(200).json({ 
      message: 'Upvoted successfully',
      upvotes: updatedProject[0].upvotes 
    });
  } catch (error) {
    console.error('Error upvoting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
