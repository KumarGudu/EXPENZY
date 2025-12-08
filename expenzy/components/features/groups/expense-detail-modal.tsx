'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupExpense } from '@/types/split';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/lib/utils/currency';
import { calculateUserExpenseBalance } from '@/lib/utils/balance-utils';
import { getIconByName } from '@/lib/categorization/category-icons';
import { useDeleteGroupExpense } from '@/lib/hooks/use-group-expenses';
import { Pencil, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseDetailModalProps {
    expense: GroupExpense | null;
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string;
    groupId: string;
    isMobile?: boolean;
}

export function ExpenseDetailModal({
    expense,
    isOpen,
    onClose,
    currentUserId,
    groupId,
    isMobile = false,
}: ExpenseDetailModalProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const deleteExpense = useDeleteGroupExpense();

    if (!expense) return null;

    const balance = calculateUserExpenseBalance(expense, currentUserId);
    const CategoryIcon = getIconByName(expense.category?.icon || 'MoreHorizontal');
    const isPaidByYou = expense.paidByUserId === currentUserId;
    const paidByName = expense.paidBy
        ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}`.trim()
        : 'Unknown';

    const handleEdit = () => {
        router.push(`/dashboard/groups/${groupId}/add-expense?expenseId=${expense.id}`);
        onClose();
    };

    const handleDelete = async () => {
        try {
            await deleteExpense.mutateAsync({ groupId, expenseId: expense.id });
            setShowDeleteDialog(false);
            onClose();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const content = (
        <div className="space-y-5 pb-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/10">
                    <CategoryIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate mb-1">{expense.description}</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        {formatCurrency(Number(expense.amount), expense.currency as 'INR' | 'USD' | 'EUR')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
                    </p>
                </div>
            </div>

            {/* Payer Info */}
            <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Paid by</p>
                <p className="text-base font-semibold">
                    {isPaidByYou ? 'You' : paidByName} paid {formatCurrency(Number(expense.amount), expense.currency as 'INR' | 'USD' | 'EUR')}
                </p>
            </div>

            {/* Your Balance */}
            {balance.displayText !== 'not involved' && balance.displayText !== 'settled' && (
                <div className={`rounded-2xl p-5 border-2 ${balance.youLent > 0
                    ? 'bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 border-green-200 dark:border-green-900/50'
                    : 'bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/30 dark:to-red-950/10 border-red-200 dark:border-red-900/50'
                    }`}>
                    <p className={`text-sm font-bold mb-2 uppercase tracking-wide ${balance.youLent > 0
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-red-700 dark:text-red-400'
                        }`}>
                        {balance.youLent > 0 ? 'You lent' : 'You borrowed'}
                    </p>
                    <p className={`text-4xl font-black ${balance.youLent > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}>
                        {formatCurrency(
                            balance.youLent > 0 ? balance.youLent : balance.youBorrowed,
                            expense.currency as 'INR' | 'USD' | 'EUR'
                        )}
                    </p>
                </div>
            )}

            {/* Participants */}
            <div>
                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Split with</p>
                <div className="space-y-2.5">
                    {expense.splits?.map((split) => (
                        <div key={split.id} className="flex items-center justify-between py-3 px-4 bg-muted/20 rounded-xl border border-border/30">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="text-sm font-bold text-primary">
                                        {split.user?.firstName?.[0] || '?'}
                                    </span>
                                </div>
                                <span className="text-base font-semibold">
                                    {split.userId === currentUserId
                                        ? 'You'
                                        : `${split.user?.firstName || 'Unknown'} ${split.user?.lastName || ''}`.trim()}
                                </span>
                            </div>
                            <span className="text-base font-bold">
                                {formatCurrency(Number(split.amountOwed), expense.currency as 'INR' | 'USD' | 'EUR')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 text-base font-semibold rounded-xl"
                    onClick={handleEdit}
                >
                    <Pencil className="h-5 w-5 mr-2" />
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1 h-14 text-base font-semibold rounded-xl"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="max-w-[90vw] rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Delete expense?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            This will permanently delete &quot;{expense.description}&quot; and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="h-12 text-base font-semibold rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="h-12 text-base font-semibold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteExpense.isPending}
                        >
                            {deleteExpense.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

    // Mobile: Use Sheet
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="bottom"
                    className="h-[92vh] rounded-t-3xl px-6 pt-6 pb-safe"
                >
                    <SheetHeader className="text-left mb-6">
                        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
                        <SheetTitle className="sr-only">Expense Details</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(92vh-100px)] pb-6 -mx-6 px-6">
                        {content}
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop: Use Dialog
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="sr-only">Expense Details</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}
