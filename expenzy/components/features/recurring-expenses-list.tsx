'use client';

import { useRecurringExpenses, useDeleteRecurringExpense, type RecurringExpense } from '@/lib/hooks/use-recurring-expenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repeat, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function RecurringExpensesList() {
    const { data: patterns, isLoading } = useRecurringExpenses();
    const deletePattern = useDeleteRecurringExpense();

    const getFrequencyLabel = (frequency: string, interval: number) => {
        const freq = frequency.toLowerCase();
        if (interval === 1) {
            return freq.charAt(0).toUpperCase() + freq.slice(1);
        }
        return `Every ${interval} ${freq === 'daily' ? 'days' : freq === 'weekly' ? 'weeks' : freq === 'monthly' ? 'months' : 'years'}`;
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Loading recurring patterns...</p>
            </div>
        );
    }

    if (!patterns || patterns.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Repeat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No recurring expense patterns yet</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {patterns.map((pattern: RecurringExpense) => (
                <Card key={pattern.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Repeat className="h-5 w-5" />
                                    {getFrequencyLabel(pattern.frequency, pattern.interval)}
                                </CardTitle>
                                <CardDescription>
                                    {pattern.isActive ? (
                                        <Badge variant="default" className="bg-green-500">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePattern.mutate(pattern.id)}
                                disabled={deletePattern.isPending}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Started</p>
                                    <p className="font-medium">{format(new Date(pattern.startDate), 'PPP')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Next Occurrence</p>
                                    <p className="font-medium">{format(new Date(pattern.nextOccurrence), 'PPP')}</p>
                                </div>
                            </div>
                        </div>
                        {pattern.endDate && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Ends on {format(new Date(pattern.endDate), 'PPP')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
