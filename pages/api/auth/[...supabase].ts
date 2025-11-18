import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../src/lib/db'
import { users } from '../../../src/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res })

  if (req.method === 'POST') {
    const { event, session } = req.body

    if (event === 'SIGNED_IN' && session) {
      try {
        // Check if user exists in our database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, session.user.id))
          .limit(1)

        if (existingUser.length === 0) {
          // Create user in our database
          await db.insert(users).values({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
          })
          console.log('New user created:', session.user.email)
        } else {
          console.log('Existing user signed in:', session.user.email)
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    }

    res.status(200).json({ message: 'Auth callback handled' })
  } else if (req.method === 'GET') {
    // Handle OAuth callback
    const { code, error } = req.query

    if (error) {
      console.error('OAuth error:', error)
      return res.redirect('/login?error=oauth_error')
    }

    if (code) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code as string)

        if (error) {
          console.error('Code exchange error:', error)
          return res.redirect('/login?error=code_exchange_failed')
        }

        // Ensure user exists in our database
        if (data.session?.user) {
          try {
            const existingUser = await db
              .select()
              .from(users)
              .where(eq(users.id, data.session.user.id))
              .limit(1);

            if (existingUser.length === 0) {
              await db.insert(users).values({
                id: data.session.user.id,
                email: data.session.user.email!,
                name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
                avatar: data.session.user.user_metadata?.avatar_url,
              });
              console.log('New OAuth user created:', data.session.user.email);
            }
          } catch (error) {
            console.error('Error syncing OAuth user:', error);
          }
        }

        // Redirect to home page after successful auth
        return res.redirect('/')
      } catch (error) {
        console.error('Auth callback error:', error)
        return res.redirect('/login?error=auth_callback_failed')
      }
    }

    res.status(400).json({ error: 'No code provided' })
  } else {
    res.setHeader('Allow', 'GET, POST')
    res.status(405).end('Method Not Allowed')
  }
}