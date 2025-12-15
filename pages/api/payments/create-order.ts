import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { razorpay } from '../../../src/lib/razorpay';
import { v7 as uuidv7 } from 'uuid';

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

        const { projectId, tier, amount } = req.body;

        if (!projectId || !tier || !amount) {
            return res.status(400).json({ message: 'Project ID, tier, and amount are required' });
        }

        const options = {
            amount: amount, // Amount in paise (e.g., 50000 for 500 INR)
            currency: 'INR',
            receipt: `receipt_${uuidv7()}`,
            notes: {
                projectId,
                tier,
                userId: user.id,
            },
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
