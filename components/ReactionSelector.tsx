import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-nextjs';
import { Rocket, Brain, Palette, Bug, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ReactionType = 'ship_it' | 'galaxy_brain' | 'pixel_perfect' | 'bug_hunter';

interface ReactionSelectorProps {
    targetId: string;
    targetType: 'project' | 'discussion' | 'comment' | 'journey_post';
    initialReactions?: Record<ReactionType, number>;
    userReaction?: ReactionType | null;
}

const REACTION_ICONS = {
    ship_it: { icon: Rocket, label: 'Ship It', color: 'text-orange-500' },
    galaxy_brain: { icon: Brain, label: 'Galaxy Brain', color: 'text-purple-500' },
    pixel_perfect: { icon: Palette, label: 'Pixel Perfect', color: 'text-pink-500' },
    bug_hunter: { icon: Bug, label: 'Bug Hunter', color: 'text-green-500' },
};

export function ReactionSelector({
    targetId,
    targetType,
    initialReactions = { ship_it: 0, galaxy_brain: 0, pixel_perfect: 0, bug_hunter: 0 },
    userReaction: initialUserReaction = null,
}: ReactionSelectorProps) {
    const session = useSession();
    const [reactions, setReactions] = useState(initialReactions);
    const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction);
    const [isLoading, setIsLoading] = useState(false);

    const handleReaction = async (type: ReactionType) => {
        if (!session) return; // Should probably show login modal
        if (isLoading) return;

        setIsLoading(true);

        // Optimistic update
        const isRemoving = userReaction === type;
        const isSwitching = userReaction && userReaction !== type;

        setUserReaction(isRemoving ? null : type);
        setReactions((prev) => {
            const next = { ...prev };
            if (isRemoving) {
                next[type]--;
            } else if (isSwitching) {
                next[userReaction!]--;
                next[type]++;
            } else {
                next[type]++;
            }
            return next;
        });

        try {
            const res = await fetch('/api/reactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    targetId,
                    targetType,
                    type,
                }),
            });

            if (!res.ok) throw new Error('Failed to react');
        } catch (error) {
            // Revert optimistic update
            console.error(error);
            setUserReaction(initialUserReaction);
            setReactions(initialReactions);
        } finally {
            setIsLoading(false);
        }
    };

    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    return (
        <div className="flex items-center gap-2">
            {/* Display active reactions */}
            {Object.entries(reactions).map(([type, count]) => {
                if (count === 0) return null;
                const rType = type as ReactionType;
                const config = REACTION_ICONS[rType];
                const Icon = config.icon;
                const isActive = userReaction === rType;

                return (
                    <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleReaction(rType)}
                        className={cn(
                            "h-8 px-2 gap-1.5 transition-all hover:bg-muted/50",
                            isActive && "bg-muted/50 border-primary/50"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", config.color)} />
                        <span className="text-xs font-medium">{count}</span>
                    </Button>
                );
            })}

            {/* Add Reaction Button */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                    >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1 flex gap-1" align="start">
                    {(Object.keys(REACTION_ICONS) as ReactionType[]).map((type) => {
                        const config = REACTION_ICONS[type];
                        const Icon = config.icon;
                        return (
                            <Button
                                key={type}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                onClick={() => handleReaction(type)}
                                title={config.label}
                            >
                                <Icon className={cn("w-4 h-4", config.color)} />
                            </Button>
                        );
                    })}
                </PopoverContent>
            </Popover>
        </div>
    );
}
