'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { useConsolidatedLoans } from '@/lib/hooks/use-loans';
import { usePersonLoans } from '@/lib/hooks/use-person-loans';
import { useProfile } from '@/lib/hooks/use-profile';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoanTransactionItem } from '@/components/features/loans/loan-transaction-item';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PersonLoansPage() {
    const router = useRouter();
    const params = useParams();
    const personId = params.personId as string;
    const { data: consolidatedData } = useConsolidatedLoans();
    const { data: profile } = useProfile();
    const {
        data: loansData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePersonLoans(personId);
    const { setLayoutVisibility } = useLayout();
    const observerTarget = useRef<HTMLDivElement>(null);

    // Hide mobile header on mount, restore on unmount (keep bottom nav)
    useEffect(() => {
        setLayoutVisibility({ showMobileHeader: false, showBottomNav: true });
        return () => {
            setLayoutVisibility({ showMobileHeader: true, showBottomNav: true });
        };
    }, [setLayoutVisibility]);

    // Infinite scroll observer
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    if (isLoading) {
        return (
            <PageWrapper>
                <LoadingSkeleton count={5} />
            </PageWrapper>
        );
    }

    // Get person summary from consolidated data
    const personSummary = consolidatedData?.personSummaries?.find(p => p.personId === personId);

    // Flatten all pages of loans
    const allLoans = loansData?.pages.flatMap(page => page.data) || [];
    const currentUserId = profile?.id || '';

    if (!personSummary && allLoans.length === 0) {
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
        : (allLoans[0]?.lenderUserId === personId ? allLoans[0].lender : allLoans[0].borrower);

    const netAmount = personSummary?.totalAmount || 0;
    const isLent = personSummary?.loanType === 'lent';
    const directAmount = personSummary?.directLoanAmount || 0;
    const groupAmount = personSummary?.groupBalanceAmount || 0;

    return (
        <PageWrapper>
            <div className="space-y-4 pb-20">
                {/* Mobile Back Button */}
                <div className="md:hidden -mx-4 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Person Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={person.avatarUrl || undefined} />
                            <AvatarFallback>
                                {person.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-bold">{person.username}</h1>
                            <p className="text-sm text-muted-foreground">
                                {personSummary?.activeCount || 0} active • {personSummary?.paidCount || 0} paid
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">
                            {isLent ? 'They owe you' : 'You owe them'}
                        </p>
                        <p className={cn(
                            'text-2xl font-bold',
                            isLent ? 'text-foreground' : 'text-foreground'
                        )}>
                            {formatCurrency(Math.abs(netAmount), 'INR')}
                        </p>
                    </div>
                </div>

                {/* Breakdown Card */}
                {personSummary && (directAmount !== 0 || groupAmount !== 0) && (
                    <Card className="p-4">
                        <h3 className="text-sm font-semibold mb-3">Breakdown</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Direct Loans</p>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(Math.abs(directAmount), 'INR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Group Balances</p>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(Math.abs(groupAmount), 'INR')}
                                </p>
                            </div>
                        </div>

                        {/* Group Details */}
                        {personSummary.groupDetails && personSummary.groupDetails.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-muted-foreground mb-2">From Groups:</p>
                                <div className="space-y-1">
                                    {personSummary.groupDetails.map((group) => (
                                        <div key={group.groupId} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{group.groupName}</span>
                                            <span className="font-medium">
                                                {formatCurrency(Math.abs(group.amount), 'INR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {/* All Transactions */}
                <div className="space-y-0">
                    <h3 className="text-base font-semibold mb-3 px-4 md:px-0">All Transactions</h3>

                    {allLoans.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {allLoans.map((loan) => {
                                const isLender = loan.lenderUserId === currentUserId;
                                const amount = parseFloat(loan.amount);

                                return (
                                    <LoanTransactionItem
                                        key={loan.id}
                                        date={new Date(loan.loanDate)}
                                        description={loan.description || ''}
                                        amount={amount}
                                        currency={loan.currency as 'INR' | 'USD' | 'EUR'}
                                        isLent={isLender}
                                        status={loan.status}
                                    />
                                );
                            })}

                            {/* Infinite scroll trigger */}
                            <div ref={observerTarget} className="h-4" />

                            {/* Loading indicator */}
                            {isFetchingNextPage && (
                                <div className="py-4 text-center">
                                    <LoadingSkeleton count={3} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
