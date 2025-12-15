import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/drizzle';
import { reactions } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, targetId, targetType, type } = req.body;

    if (!userId || !targetId || !targetType || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if reaction already exists
        const existingReaction = await db.query.reactions.findFirst({
            where: and(
                eq(reactions.userId, userId),
                eq(reactions.targetId, targetId),
                eq(reactions.targetType, targetType)
            ),
        });

        if (existingReaction) {
            if (existingReaction.type === type) {
                // If same type, remove it (toggle off)
                await db.delete(reactions).where(eq(reactions.id, existingReaction.id));
                return res.status(200).json({ action: 'removed' });
            } else {
                // If different type, update it
                await db
                    .update(reactions)
                    .set({ type })
                    .where(eq(reactions.id, existingReaction.id));
                return res.status(200).json({ action: 'updated' });
            }
        } else {
            // Create new reaction
            await db.insert(reactions).values({
                id: uuidv4(),
                userId,
                targetId,
                targetType,
                type,
            });
            return res.status(200).json({ action: 'added' });
        }
    } catch (error) {
        console.error('Error handling reaction:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
