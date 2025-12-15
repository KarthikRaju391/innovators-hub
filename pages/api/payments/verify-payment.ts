import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { db } from '../../../src/lib/db';
import { supporters, transactions, projects } from '../../../src/lib/db/schema';
import { v7 as uuidv7 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

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

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            projectId,
            tier,
            amount,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Payment details are required' });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Fetch project to get creatorId
        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if already a supporter
        let supporterRecord = await db.query.supporters.findFirst({
            where: and(
                eq(supporters.supporterId, user.id),
                eq(supporters.projectId, projectId)
            ),
        });

        let supporterId = supporterRecord?.id;

        if (!supporterRecord) {
            // Create new supporter
            const newSupporter = await db.insert(supporters).values({
                id: uuidv7(),
                supporterId: user.id,
                creatorId: project.creatorId,
                projectId: projectId,
                tier: tier,
                amountPaid: amount,
                isActive: true,
            }).returning();
            supporterId = newSupporter[0].id;
        } else {
            // Update existing supporter
            // Logic: If new tier is higher, update tier. Always add amount.
            // For simplicity, we just update tier to the new one if it's a "purchase" of that tier
            await db.update(supporters)
                .set({
                    tier: tier,
                    amountPaid: (supporterRecord.amountPaid || 0) + amount,
                    isActive: true,
                })
                .where(eq(supporters.id, supporterRecord.id));
        }

        // Record transaction
        await db.insert(transactions).values({
            id: uuidv7(),
            supporterId: supporterId!,
            amount: amount,
            tier: tier,
            paymentType: 'one-time',
            razorpayId: razorpay_payment_id,
            status: 'completed',
        });

        res.status(200).json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
