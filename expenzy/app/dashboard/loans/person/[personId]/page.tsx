'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useConsolidatedLoans } from '@/lib/hooks/use-loans';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PersonLoansPage() {
    const router = useRouter();
    const params = useParams();
    const personId = params.personId as string;
    const { data, isLoading } = useConsolidatedLoans();
    const { setLayoutVisibility } = useLayout();

    // Hide mobile header on mount, restore on unmount (keep bottom nav)
    useEffect(() => {
        setLayoutVisibility({ showMobileHeader: false, showBottomNav: true });
        return () => {
            setLayoutVisibility({ showMobileHeader: true, showBottomNav: true });
        };
    }, [setLayoutVisibility]);

    if (isLoading) {
        return (
            <PageWrapper>
                <LoadingSkeleton count={5} />
            </PageWrapper>
        );
    }

    // Get person summary from consolidated data
    const personSummary = data?.personSummaries?.find(p => p.personId === personId);

    // Get all loans for this person
    const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
    const personLoans = data?.directLoans?.filter(
        (loan) =>
            (loan.lenderUserId === personId && loan.borrowerUserId === currentUserId) ||
            (loan.borrowerUserId === personId && loan.lenderUserId === currentUserId)
    ) || [];

    if (!personSummary && personLoans.length === 0) {
        return (
            <PageWrapper>
                <EmptyState
                    icon={FileText}
                    title="No loans found"
                    description="No loans found with this person"
                    action={{
                        label: 'Go Back',
                        onClick: () => router.back(),
                    }}
                />
            </PageWrapper>
        );
    }

    // Get person info from summary or first loan
    const person = personSummary
        ? { username: personSummary.personName, avatarUrl: personSummary.personAvatar, avatar: null }
        : (personLoans[0]?.lenderUserId === personId ? personLoans[0].lender : personLoans[0].borrower);

    const netAmount = personSummary?.totalAmount || 0;
    const isLent = personSummary?.loanType === 'lent';
    const directAmount = personSummary?.directLoanAmount || 0;
    const groupAmount = personSummary?.groupBalanceAmount || 0;

    return (
        <PageWrapper>
            <div className="space-y-6">
                {/* Back Button - Hidden on mobile */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 hidden lg:flex"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Loans
                </Button>

                {/* Person Header with Breakdown */}
                <Card className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            <Avatar className="h-12 w-12 md:h-16 md:w-16">
                                <AvatarImage
                                    src={person.avatarUrl || person.avatar || undefined}
                                    alt={person.username}
                                />
                                <AvatarFallback className="text-base md:text-lg">
                                    {person.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold">{person.username}</h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {personSummary?.activeCount || 0} active • {personSummary?.paidCount || 0} paid
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={cn(
                                'text-2xl md:text-3xl font-bold',
                                isLent ? 'text-green-600' : 'text-red-600'
                            )}>
                                {formatCurrency(Math.abs(netAmount))}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {isLent ? 'They owe you' : 'You owe them'}
                            </p>
                        </div>
                    </div>

                    {/* Breakdown */}
                    {personSummary && (directAmount !== 0 || groupAmount !== 0) && (
                        <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Breakdown</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Direct Loans</p>
                                    <p className={cn(
                                        "text-base font-semibold",
                                        directAmount >= 0 ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {formatCurrency(Math.abs(directAmount))}
                                    </p>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Group Balances</p>
                                    <p className={cn(
                                        "text-base font-semibold",
                                        groupAmount >= 0 ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {formatCurrency(Math.abs(groupAmount))}
                                    </p>
                                </div>
                            </div>

                            {/* Group Details */}
                            {personSummary.groupDetails && personSummary.groupDetails.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs text-muted-foreground mb-2">From Groups:</p>
                                    <div className="space-y-1">
                                        {personSummary.groupDetails.map((group) => (
                                            <div key={group.groupId} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{group.groupName}</span>
                                                <span className={cn(
                                                    "font-medium",
                                                    group.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                                )}>
                                                    {formatCurrency(Math.abs(group.amount))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                {/* All Transactions */}
                <div className="space-y-0">
                    <h3 className="text-base font-semibold mb-3 px-4 md:px-0">All Transactions</h3>

                    {personLoans.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {personLoans.map((loan) => {
                                const isLender = loan.lenderUserId === currentUserId;
                                const amount = parseFloat(loan.amount);
                                const loanDate = new Date(loan.loanDate);
                                const dayMonth = loanDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit'
                                });

                                return (
                                    <div
                                        key={loan.id}
                                        className="flex items-center gap-3 py-2.5 hover:bg-muted/30 -mx-4 px-4 transition-colors border-b border-border/50 last:border-0"
                                    >
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
                                                {loan.description || (isLender ? 'Loan given' : 'Loan received')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {loan.status === 'active' ? 'Active' : 'Paid'} • {loan.currency}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                                {isLender ? 'you lent' : 'you borrowed'}
                                            </p>
                                            <p className={cn(
                                                'text-sm font-semibold',
                                                isLender ? 'text-green-600' : 'text-red-600'
                                            )}>
                                                {formatCurrency(amount, loan.currency as 'INR' | 'USD' | 'EUR')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
