'use client';

import { formatCurrency } from '@/lib/utils/currency';
import type { SimplifiedDebt } from '@/types/split';

interface SimplifiedDebtsCardProps {
    debts: SimplifiedDebt[];
    currentMemberId: string;
    currency?: 'INR' | 'USD' | 'EUR';
}

export function SimplifiedDebtsCard({
    debts,
    currentMemberId,
    currency = 'INR',
}: SimplifiedDebtsCardProps) {
    if (!debts || debts.length === 0) {
        return (
            <div className="py-4">
                <p className="text-sm text-muted-foreground">
                    All settled up! No pending payments.
                </p>
            </div>
        );
    }

    // Calculate total you owe and total you're owed
    let totalOwed = 0;
    let totalLent = 0;

    debts.forEach((debt) => {
        if (debt.fromMemberId === currentMemberId) {
            totalOwed += debt.amount;
        } else if (debt.toMemberId === currentMemberId) {
            totalLent += debt.amount;
        }
    });

    const netBalance = totalLent - totalOwed;

    return (
        <div className="space-y-3">
            {/* Summary */}
            {netBalance !== 0 && (
                <div className="py-3 border-b border-border">
                    <p className={`text-base font-medium ${netBalance > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                        }`}>
                        {netBalance > 0
                            ? `You are owed ${formatCurrency(netBalance, currency)} overall`
                            : `You owe ${formatCurrency(Math.abs(netBalance), currency)} overall`
                        }
                    </p>
                </div>
            )}

            {/* Individual settlements */}
            <div className="space-y-1">
                {debts.map((debt, index) => {
                    const isYouPaying = debt.fromMemberId === currentMemberId;
                    const isYouReceiving = debt.toMemberId === currentMemberId;

                    // Get the other person's name
                    const otherPersonName = isYouPaying
                        ? (debt.toMember?.name || 'Unknown')
                        : (debt.fromMember?.name || 'Unknown');

                    // Create simple text
                    const displayText = isYouPaying
                        ? `You owe ${otherPersonName}`
                        : isYouReceiving
                            ? `${otherPersonName} owes you`
                            : `${debt.fromMember?.name || 'Unknown'} owes ${debt.toMember?.name || 'Unknown'}`;

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between py-2 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors"
                        >
                            <span className="text-sm text-muted-foreground">{displayText}</span>
                            <span
                                className={`text-sm font-medium ${isYouPaying
                                    ? 'text-red-500 dark:text-red-400'
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
        </div>
    );
}
