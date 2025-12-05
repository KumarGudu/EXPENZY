'use client';

import { ExpenseCard } from './expense-card';
import { EmptyState } from '@/components/shared/empty-state';
import type { GroupExpense } from '@/types/split';

interface ExpenseListProps {
    expenses: GroupExpense[];
    groupId: string;
    currentUserId: string;
}

export function ExpenseList({ expenses, groupId, currentUserId }: ExpenseListProps) {
    // Ensure expenses is always an array
    const expenseArray = Array.isArray(expenses) ? expenses : [];

    if (expenseArray.length === 0) {
        return (
            <EmptyState
                title="No expenses yet"
                description="Add your first expense to start splitting with your group"
            />
        );
    }

    // Group by month
    const groupedExpenses = expenseArray.reduce((acc, expense) => {
        const date = new Date(expense.expenseDate);
        const month = date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(expense);
        return acc;
    }, {} as Record<string, GroupExpense[]>);

    // Sort months in descending order
    const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => {
        const dateA = new Date(groupedExpenses[a][0].expenseDate);
        const dateB = new Date(groupedExpenses[b][0].expenseDate);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <div className="space-y-6">
            {sortedMonths.map((month) => (
                <div key={month}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        {month}
                    </h3>
                    <div className="space-y-2">
                        {groupedExpenses[month]
                            .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
                            .map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    groupId={groupId}
                                    currentUserId={currentUserId}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
