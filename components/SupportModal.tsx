import * as React from "react";
import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { createBrowserClient } from '@supabase/ssr';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        id: string;
        title: string;
        creator: {
            name?: string;
        };
    };
}

const TIERS = [
    {
        id: 'hype',
        name: 'Hype Supporter',
        price: 0,
        description: 'Show your support and join the discussion.',
        features: [
            'Start discussions',
            'Hype Supporter badge',
            'Access public content'
        ],
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
        id: 'early-access',
        name: 'Early Access',
        price: 500, // 500 INR (approx $6)
        description: 'Get access to new versions before everyone else.',
        features: [
            'All Hype benefits',
            '1-week early access',
            'Supporter-only posts',
            'Early Access badge'
        ],
        color: 'bg-purple-50 border-purple-200 text-purple-700',
        buttonColor: 'bg-purple-600 hover:bg-purple-700',
        popular: true
    },
    {
        id: 'champion',
        name: 'Champion',
        price: 1500, // 1500 INR (approx $18)
        description: 'Become a top supporter and get featured.',
        features: [
            'All Early Access benefits',
            'Direct messaging',
            'Featured badge',
            'Champion badge'
        ],
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        buttonColor: 'bg-amber-600 hover:bg-amber-700'
    }
];

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SupportModal({ isOpen, onClose, project }: SupportModalProps) {
    const [loading, setLoading] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSupport = async (tier: typeof TIERS[0]) => {
        setLoading(tier.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Redirect to login or show login modal
                alert('Please login to support this project');
                return;
            }

            if (tier.price === 0) {
                // Free tier logic (just add to supporters table directly via API)
                // For now, we treat it as a "payment" of 0 amount
                await processPayment(tier, session.user.id);
            } else {
                // Paid tier logic
                await processPayment(tier, session.user.id);
            }
        } catch (error) {
            console.error('Support error:', error);
            alert('Failed to process support. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const processPayment = async (tier: typeof TIERS[0], userId: string) => {
        // 1. Create Order
        const orderRes = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: project.id,
                tier: tier.id,
                amount: tier.price * 100 // Amount in paise
            })
        });

        if (!orderRes.ok) {
            throw new Error('Failed to create order');
        }

        const order = await orderRes.json();

        // 2. Open Razorpay
        console.log('Initializing Razorpay with key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
        console.log('Order details:', order);

        if (typeof (window as any).Razorpay === 'undefined') {
            console.error('Razorpay SDK not loaded');
            alert('Razorpay SDK failed to load. Please refresh the page.');
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // We need to expose this
            amount: order.amount,
            currency: order.currency,
            name: "Innovators' Hub",
            description: `Support ${project.title} - ${tier.name}`,
            order_id: order.id,
            handler: async function (response: any) {
                console.log('Payment success:', response);
                // 3. Verify Payment
                const verifyRes = await fetch('/api/payments/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        projectId: project.id,
                        tier: tier.id,
                        amount: tier.price * 100
                    })
                });

                if (verifyRes.ok) {
                    alert(`Thank you for becoming a ${tier.name}!`);
                    onClose();
                    // Ideally refresh the page or update state
                    window.location.reload();
                } else {
                    console.error('Payment verification failed');
                    alert('Payment verification failed');
                }
            },
            prefill: {
                // We could prefill user details here if we had them
            },
            theme: {
                color: tier.id === 'champion' ? '#d97706' : tier.id === 'early-access' ? '#9333ea' : '#2563eb'
            },
            modal: {
                ondismiss: function () {
                    console.log('Checkout modal closed');
                    setLoading(null);
                }
            }
        };

        try {
            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                alert(response.error.description);
                setLoading(null);
            });
            rzp1.open();
            console.log('Razorpay opened');
        } catch (err) {
            console.error('Error opening Razorpay:', err);
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Support {project.title}</h2>
                        <p className="text-sm text-gray-500">by {project.creator.name || 'Creator'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`
                relative rounded-xl border-2 p-6 flex flex-col
                ${tier.popular ? 'border-purple-500 shadow-lg scale-105 md:-mt-4 md:mb-4 bg-white' : 'border-gray-100 bg-gray-50/50'}
                transition-all duration-200 hover:border-gray-300
              `}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className={`text-lg font-bold ${tier.id === 'champion' ? 'text-amber-600' : tier.id === 'early-access' ? 'text-purple-600' : 'text-blue-600'}`}>
                                    {tier.name}
                                </h3>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-3xl font-extrabold text-gray-900">
                                        {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                                    </span>
                                    {tier.price > 0 && <span className="ml-1 text-gray-500 text-sm">one-time</span>}
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.id === 'champion' ? 'text-amber-500' : tier.id === 'early-access' ? 'text-purple-500' : 'text-blue-500'}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleSupport(tier)}
                                disabled={loading !== null}
                                className={`w-full ${tier.buttonColor} text-white border-none`}
                            >
                                {loading === tier.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    tier.price === 0 ? 'Join for Free' : `Support with ₹${tier.price}`
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                    Secure payments powered by Razorpay. 100% of support goes directly to the creator (minus platform fees).
                </div>
            </div>
        </div>
    );
}
