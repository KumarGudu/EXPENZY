'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteAccount } from '@/lib/hooks/use-profile';
import { useAuth } from '@/contexts/auth-context';
import { z } from 'zod';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';

const deleteAccountSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

interface DeleteAccountModalProps {
    open: boolean;
    onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
    const deleteAccount = useDeleteAccount();
    const { logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeleteAccountFormData>({
        resolver: zodResolver(deleteAccountSchema),
    });

    const onSubmit = async (data: DeleteAccountFormData) => {
        await deleteAccount.mutateAsync(data);
        reset();
        onClose();
        // Logout and redirect to login page
        setTimeout(() => {
            logout();
        }, 1000);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl">Delete Account</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                This action cannot be undone
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Your account and all associated data will be permanently deleted. This includes all transactions, budgets, and settings.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Enter your password to confirm
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="Enter your password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={deleteAccount.isPending}
                                className="flex-1"
                            >
                                {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
