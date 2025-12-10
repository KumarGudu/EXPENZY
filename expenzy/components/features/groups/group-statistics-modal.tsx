'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/utils/currency';
import type { GroupStatistics } from '@/lib/hooks/use-group-statistics';
import type { SimplifiedDebt } from '@/types/split';
import { TrendingUp, TrendingDown, Receipt, ArrowRight } from 'lucide-react';

interface GroupStatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    statistics: GroupStatistics | undefined;
    simplifiedDebts?: SimplifiedDebt[];
    currentUserId?: string;
    isMobile?: boolean;
    currency?: 'INR' | 'USD' | 'EUR';
}

export function GroupStatisticsModal({
    isOpen,
    onClose,
    statistics,
    simplifiedDebts = [],
    currentUserId,
    isMobile = false,
    currency = 'INR',
}: GroupStatisticsModalProps) {
    if (!statistics) return null;

    const content = (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4 text-primary" />
                        <p className="text-xs font-medium text-muted-foreground">Total Expenses</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{statistics.expenseCount}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Average</p>
                    <p className="text-2xl font-bold">
                        {formatCurrency(statistics.averageExpense, currency)}
                    </p>
                </div>
            </div>

            {/* Spending Breakdown */}
            <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 border border-blue-200 dark:border-blue-900/50">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            Group Total
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(statistics.totalSpending, currency)}
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/30 dark:to-purple-950/10 border border-purple-200 dark:border-purple-900/50">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                            You Paid
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(statistics.yourTotalSpending, currency)}
                    </p>
                </div>
            </div>

            {/* Settlements - Debt Simplification */}
            <div>
                <h4 className="text-sm font-semibold mb-3">Settlements</h4>
                {simplifiedDebts.length === 0 ? (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-center">
                        <p className="text-base font-medium text-green-700 dark:text-green-400">
                            ✓ All settled up!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                            No pending payments
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {simplifiedDebts.map((debt, index) => {
                            const isYouOwing = debt.fromUserId === currentUserId;
                            const isYouReceiving = debt.toUserId === currentUserId;

                            const fromName = isYouOwing
                                ? 'You'
                                : debt.fromUser
                                    ? `${debt.fromUser.firstName || ''} ${debt.fromUser.lastName || ''}`.trim() || debt.fromUser.username
                                    : 'Unknown';

                            const toName = isYouReceiving
                                ? 'you'
                                : debt.toUser
                                    ? `${debt.toUser.firstName || ''} ${debt.toUser.lastName || ''}`.trim() || debt.toUser.username
                                    : 'Unknown';

                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${isYouOwing
                                            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
                                            : isYouReceiving
                                                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50'
                                                : 'bg-muted/30 border-muted'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className={`text-base font-medium ${isYouOwing
                                                    ? 'text-red-700 dark:text-red-400'
                                                    : isYouReceiving
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-foreground'
                                                }`}>
                                                {fromName}
                                            </span>
                                            <ArrowRight className={`h-4 w-4 ${isYouOwing
                                                    ? 'text-red-600 dark:text-red-500'
                                                    : isYouReceiving
                                                        ? 'text-green-600 dark:text-green-500'
                                                        : 'text-muted-foreground'
                                                }`} />
                                            <span className={`text-base font-medium ${isYouOwing
                                                    ? 'text-red-700 dark:text-red-400'
                                                    : isYouReceiving
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-foreground'
                                                }`}>
                                                {toName}
                                            </span>
                                        </div>
                                        <span className={`text-lg font-bold ${isYouOwing
                                                ? 'text-red-600 dark:text-red-400'
                                                : isYouReceiving
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-foreground'
                                            }`}>
                                            {formatCurrency(debt.amount, currency)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            {Object.keys(statistics.categoryBreakdown).length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold mb-3">Category Breakdown</h4>
                    <div className="space-y-2">
                        {Object.entries(statistics.categoryBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([category, amount]) => (
                                <div
                                    key={category}
                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                                >
                                    <span className="text-sm font-medium">{category}</span>
                                    <span className="text-sm font-bold">
                                        {formatCurrency(amount, currency)}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-4 pt-4">
                    <SheetHeader className="text-left mb-4">
                        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
                        <SheetTitle className="text-xl font-bold">Group Statistics</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(85vh-80px)] pb-4 -mx-4 px-4">
                        {content}
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Group Statistics</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}
