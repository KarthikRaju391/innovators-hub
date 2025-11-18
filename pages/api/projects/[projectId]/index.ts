import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../src/lib/db';
import { projects, users, discussions } from '../../../../src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  if (req.method === 'GET') {
    try {
      // Get project with creator info and discussion count
      const result = await db
        .select({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          demoUrl: projects.demoUrl,
          repoUrl: projects.repoUrl,
          techStack: projects.techStack,
          aiToolTags: projects.aiToolTags,
          upvotes: projects.upvotes,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
          creator: {
            id: users.id,
            name: users.name,
            avatar: users.avatar,
            bio: users.bio,
          },
          discussionCount: sql<number>`(SELECT COUNT(*) FROM ${discussions} WHERE ${discussions.projectId} = ${projects.id})`,
        })
        .from(projects)
        .leftJoin(users, eq(projects.creatorId, users.id))
        .where(eq(projects.id, projectId))
        .limit(1);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    // TODO: Implement project update
    return res.status(501).json({ message: 'Not implemented yet' });
  } else if (req.method === 'DELETE') {
    // TODO: Implement project deletion
    return res.status(501).json({ message: 'Not implemented yet' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}