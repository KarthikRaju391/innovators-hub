import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/lib/db';
import { discussions, users, comments } from '../../../src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { discussionId } = req.query;

  if (!discussionId || typeof discussionId !== 'string') {
    return res.status(400).json({ message: 'Discussion ID is required' });
  }

  if (req.method === 'GET') {
    try {
      // Get discussion with author info and comment count
      const result = await db
        .select({
          id: discussions.id,
          title: discussions.title,
          content: discussions.content,
          upvotes: discussions.upvotes,
          createdAt: discussions.createdAt,
          updatedAt: discussions.updatedAt,
          projectId: discussions.projectId,
          author: {
            id: users.id,
            name: users.name,
            avatar: users.avatar,
          },
          commentCount: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.discussionId} = ${discussions.id})`,
        })
        .from(discussions)
        .leftJoin(users, eq(discussions.authorId, users.id))
        .where(eq(discussions.id, discussionId))
        .limit(1);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Discussion not found' });
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error fetching discussion:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
