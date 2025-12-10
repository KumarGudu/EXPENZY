'use client';

import { formatCurrency } from '@/lib/utils/currency';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';

interface SimplifiedDebt {
    from: string;
    to: string;
    amount: number;
    fromUser?: { firstName: string; lastName: string };
    toUser?: { firstName: string; lastName: string };
}

interface SimplifiedDebtsCardProps {
    debts: SimplifiedDebt[];
    currentUserId: string;
    currency?: 'INR' | 'USD' | 'EUR';
}

export function SimplifiedDebtsCard({
    debts,
    currentUserId,
    currency = 'INR',
}: SimplifiedDebtsCardProps) {
    if (!debts || debts.length === 0) {
        return (
            <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-2">Settlements</h3>
                <p className="text-sm text-muted-foreground">
                    All settled up! No pending payments.
                </p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Settlements</h3>
            <div className="space-y-3">
                {debts.map((debt, index) => {
                    const isYouPaying = debt.from === currentUserId;
                    const isYouReceiving = debt.to === currentUserId;

                    const fromName = isYouPaying
                        ? 'You'
                        : debt.fromUser
                            ? `${debt.fromUser.firstName} ${debt.fromUser.lastName}`.trim()
                            : 'Unknown';

                    const toName = isYouReceiving
                        ? 'you'
                        : debt.toUser
                            ? `${debt.toUser.firstName} ${debt.toUser.lastName}`.trim()
                            : 'Unknown';

                    return (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${isYouPaying
                                    ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50'
                                    : isYouReceiving
                                        ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50'
                                        : 'bg-muted/30'
                                }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <span className="font-medium">{fromName}</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{toName}</span>
                            </div>
                            <span
                                className={`font-bold ${isYouPaying
                                        ? 'text-red-600 dark:text-red-400'
                                        : isYouReceiving
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-foreground'
                                    }`}
                            >
                                {formatCurrency(debt.amount, currency)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
