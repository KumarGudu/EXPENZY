'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateGroupExpense } from '@/lib/hooks/use-group-expenses';
import { SplitConfigurator } from './split-configurator';
import type { SplitType, ParticipantInput } from '@/types/split';
import { toast } from 'sonner';

interface AddExpenseModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
    members: Array<{ id: string; username: string; email: string }>;
}

export function AddExpenseModal({
    open,
    onClose,
    groupId,
    members,
}: AddExpenseModalProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [splitType, setSplitType] = useState<SplitType>('equal');
    const [participants, setParticipants] = useState<ParticipantInput[]>([]);
    const [notes, setNotes] = useState('');

    const createExpense = useCreateGroupExpense();

    const handleClose = () => {
        // Reset form on close
        setDescription('');
        setAmount('');
        setSplitType('equal');
        setParticipants([]);
        setNotes('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            toast.error('Please enter a description');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (participants.length === 0) {
            toast.error('Please select at least one person to split with');
            return;
        }

        try {
            await createExpense.mutateAsync({
                groupId,
                data: {
                    description: description.trim(),
                    amount: parseFloat(amount),
                    splitType,
                    participants,
                    notes: notes.trim() || undefined,
                    expenseDate: new Date().toISOString(),
                },
            });

            handleClose();
        } catch (_error) {
            // Error is handled by the mutation
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Dinner at restaurant"
                            className="mt-1"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="mt-1"
                        />
                    </div>

                    {/* Split Configurator */}
                    <SplitConfigurator
                        splitType={splitType}
                        onSplitTypeChange={setSplitType}
                        members={members}
                        amount={parseFloat(amount) || 0}
                        participants={participants}
                        onParticipantsChange={setParticipants}
                    />

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={handleClose} disabled={createExpense.isPending}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createExpense.isPending}
                        >
                            {createExpense.isPending ? 'Adding...' : 'Add Expense'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
