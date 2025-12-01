'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile, useProfile } from '@/lib/hooks/use-profile';
import {
    updateProfileSchema,
    type UpdateProfileFormData,
} from '@/lib/validations/profile.schema';
import { useEffect } from 'react';

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
    const { data: user } = useProfile();
    const updateProfile = useUpdateProfile();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
    });

    // Reset form with user data when modal opens
    useEffect(() => {
        if (open && user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                avatar: user.avatar || '',
                timezone: user.timezone || '',
            });
        }
    }, [open, user, reset]);

    const onSubmit = async (data: UpdateProfileFormData) => {
        await updateProfile.mutateAsync(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                {...register('firstName')}
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                {...register('lastName')}
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            {...register('phone')}
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                            id="avatar"
                            {...register('avatar')}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        {errors.avatar && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.avatar.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                            id="timezone"
                            {...register('timezone')}
                            placeholder="UTC"
                        />
                        {errors.timezone && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.timezone.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateProfile.isPending}>
                            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
