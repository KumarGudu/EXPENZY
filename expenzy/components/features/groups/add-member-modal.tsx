import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAddGroupMember, useGroup } from '@/lib/hooks/use-groups';

interface AddMemberModalProps {
    groupId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
    groupId,
    open,
    onOpenChange,
}) => {
    const { data: group } = useGroup(groupId);
    const [inputValue, setInputValue] = useState('');
    const [role, setRole] = useState<'admin' | 'member'>('member');
    const addMember = useAddGroupMember();

    const isLocal = group?.isLocal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        try {
            await addMember.mutateAsync({
                groupId,
                memberEmail: isLocal ? undefined : inputValue.trim(),
                memberName: isLocal ? inputValue.trim() : undefined,
                role
            });
            setInputValue('');
            setRole('member');
            onOpenChange(false);
        } catch {
            // Error handled by the hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Add Member
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="inputValue">
                                {isLocal ? 'Full Name' : 'Email Address'}
                            </Label>
                            <Input
                                id="inputValue"
                                type={isLocal ? 'text' : 'email'}
                                placeholder={isLocal ? 'e.g., John Doe' : 'e.g., john@example.com'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            {isLocal && (
                                <p className="text-xs text-muted-foreground">
                                    This person doesn&apos;t need an account. You manage their expenses.
                                </p>
                            )}
                        </div>

                        {!isLocal && (
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(value) => setRole(value as 'admin' | 'member')}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Admins can manage members and group settings
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addMember.isPending || !inputValue.trim()}>
                            {addMember.isPending ? 'Adding...' : isLocal ? 'Add Person' : 'Add Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
