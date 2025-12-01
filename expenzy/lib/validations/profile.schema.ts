import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    phone: z.string().optional(),
    avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    timezone: z.string().optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(6, 'Current password must be at least 6 characters'),
        newPassword: z
            .string()
            .min(6, 'New password must be at least 6 characters'),
        confirmPassword: z
            .string()
            .min(6, 'Confirm password must be at least 6 characters'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    });

export const deleteAccountSchema = z.object({
    confirmation: z
        .string()
        .refine(
            (val) => val.toLowerCase() === 'delete my account',
            'You must type "delete my account" to confirm',
        ),
    password: z.string().min(6, 'Password is required for verification'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
