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
    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, bio, avatar, github_url, twitter_url, website_url, linkedin_url, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's project count
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', userId);

    // Get total upvotes across all user's projects
    const { data: projects } = await supabase
      .from('projects')
      .select('upvotes')
      .eq('creator_id', userId);

    const totalUpvotes = projects?.reduce((sum, p) => sum + (p.upvotes || 0), 0) || 0;

    // Get total supporters across all user's projects
    const { count: supportersCount } = await supabase
      .from('supporters')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', userId)
      .eq('is_active', true);

    return res.status(200).json({
      ...user,
      stats: {
        projectsCount: projectsCount || 0,
        totalUpvotes,
        supportersCount: supportersCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
