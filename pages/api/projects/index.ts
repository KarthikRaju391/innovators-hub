import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../src/lib/db';
import { projects, users } from '../../../src/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Existing GET logic
    try {
      const { tag, tech, sort = 'new', limit = '20', offset = '0' } = req.query;

      const limitNum = parseInt(limit as string, 10);
      const offsetNum = parseInt(offset as string, 10);

      let whereConditions = [];

      if (tag) {
        whereConditions.push(sql`${projects.aiToolTags} @> ${JSON.stringify([tag])}`);
      }

      if (tech) {
        whereConditions.push(sql`${projects.techStack} @> ${JSON.stringify([tech])}`);
      }

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
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // POST logic for creating project
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

      // Ensure user exists in our database
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (existingUser.length === 0) {
        await db.insert(users).values({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar: user.user_metadata?.avatar_url,
        });
      }

      const { title, description, repoUrl, demoUrl, techStack, aiToolTags } = req.body;

      if (!title || !description || !repoUrl) {
        return res.status(400).json({ message: 'Title, description, and repo URL are required' });
      }

      if (!aiToolTags || !Array.isArray(aiToolTags) || aiToolTags.length === 0) {
        return res.status(400).json({ message: 'At least one AI tool tag is required' });
      }

      if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
        return res.status(400).json({ message: 'At least one tech stack item is required' });
      }

      const newProject = await db
        .insert(projects)
        .values({
          id: uuidv7(),
          title,
          description,
          repoUrl,
          demoUrl: demoUrl || null,
          techStack: techStack || [],
          aiToolTags: aiToolTags || [],
          creatorId: user.id,
        })
        .returning();

      res.status(201).json(newProject[0]);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}