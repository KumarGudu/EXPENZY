'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';

interface LoanTransactionItemProps {
    date: Date;
    description: string;
    amount: number;
    currency: 'INR' | 'USD' | 'EUR';
    isLent: boolean;
    status?: string;
}

export function LoanTransactionItem({
    date,
    description,
    amount,
    currency,
    isLent,
    status,
}: LoanTransactionItemProps) {
    const loanDate = new Date(date);
    const dayMonth = loanDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
    });

    return (
        <div className="flex items-center gap-3 py-2.5 hover:bg-muted/30 -mx-4 px-4 transition-colors border-b border-border/50 last:border-0">
            {/* Date */}
            <div className="flex flex-col items-center w-10 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                    {dayMonth.split(' ')[0]}
                </span>
                <span className="text-base font-semibold">
                    {dayMonth.split(' ')[1]}
                </span>
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">
                    {description || (isLent ? 'Loan given' : 'Loan received')}
                </p>
                {status && (
                    <p className="text-xs text-muted-foreground">
                        {status === 'active' ? 'Active' : 'Paid'} • {currency}
                    </p>
                )}
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                    {isLent ? 'you lent' : 'you borrowed'}
                </p>
                <p className={cn(
                    'text-sm font-semibold',
                    isLent ? 'text-green-600' : 'text-red-600'
                )}>
                    {formatCurrency(amount, currency)}
                </p>
            </div>
        </div>
    );
}
