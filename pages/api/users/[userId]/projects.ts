import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:users!creator_id (
          id,
          name,
          avatar
        )
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      return res.status(500).json({ message: 'Failed to fetch projects' });
    }

    return res.status(200).json(projects || []);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
