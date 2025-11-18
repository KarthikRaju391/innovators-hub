import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../src/lib/db';
import { supporters, users } from '../../../../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db
        .select({
          id: supporters.id,
          tier: supporters.tier,
          startDate: supporters.startDate,
          amountPaid: supporters.amountPaid,
          isActive: supporters.isActive,
          supporter: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatar: users.avatar,
          },
        })
        .from(supporters)
        .leftJoin(users, eq(supporters.supporterId, users.id))
        .where(eq(supporters.projectId, projectId))
        .orderBy(desc(supporters.startDate));

      // Filter only active supporters
      const activeSupporters = result.filter(s => s.isActive);

      res.status(200).json(activeSupporters);
    } catch (error) {
      console.error('Error fetching supporters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
