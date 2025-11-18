import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/lib/db';
import { projects, users } from '../../../src/lib/db/schema';
import { eq, desc, sql, ilike } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q, tag, tech, sort = 'new', limit = '20', offset = '0' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    const searchTerm = `%${q}%`;

    // Build where conditions
    let whereConditions = [
      sql`${projects.title} ILIKE ${searchTerm} OR ${projects.description} ILIKE ${searchTerm}`
    ];

    if (tag) {
      whereConditions.push(sql`${projects.aiToolTags} @> ${JSON.stringify([tag])}`);
    }

    if (tech) {
      whereConditions.push(sql`${projects.techStack} @> ${JSON.stringify([tech])}`);
    }

    // Determine order by
    let orderBy;
    switch (sort) {
      case 'trending':
        orderBy = desc(projects.upvotes);
        break;
      case 'new':
        orderBy = desc(projects.createdAt);
        break;
      case 'supporters':
        orderBy = desc(projects.upvotes);
        break;
      default:
        orderBy = desc(projects.createdAt);
    }

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
        },
      })
      .from(projects)
      .leftJoin(users, eq(projects.creatorId, users.id))
      .where(whereConditions.length > 0 ? sql`${sql.join(whereConditions, ' AND ')}` : undefined)
      .orderBy(orderBy)
      .limit(limitNum)
      .offset(offsetNum);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}