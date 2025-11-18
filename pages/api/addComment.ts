import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/lib/db';
import { comments } from '../../src/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { permalink, body, parentId } = req.body;

  if (!permalink || !body) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Assume user is authenticated via Supabase, but for now, hardcode or get from session
    // Since no session, perhaps require auth

    const newComment = {
      id: uuidv4(),
      content: body,
      authorId: 'user-id', // Need to get from auth
      discussionId: permalink,
      parentId: parentId || null,
    };

    await db.insert(comments).values(newComment);

    res.status(200).json({ message: 'Comment added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}