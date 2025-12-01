import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type {
    User,
    UpdateProfileDto,
    ChangePasswordDto,
    DeleteAccountDto,
} from '@/types/user';
import { toast } from 'sonner';

export function useProfile() {
    return useQuery<User>({
        queryKey: ['profile'],
        queryFn: async () => {
            return await apiClient.get<User>('/users/profile');
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileDto) => {
            return await apiClient.patch<User>('/users/profile', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully');
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: ChangePasswordDto) => {
            return await apiClient.post('/users/change-password', data);
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message || 'Failed to change password';
            toast.error(message);
        },
    });
}

export function useDeleteAccount() {
    return useMutation({
        mutationFn: async (data: DeleteAccountDto) => {
            return await apiClient.post('/users/delete-account', data);
        },
        onSuccess: () => {
            toast.success('Account deleted successfully');
            // Redirect to login will be handled by the component
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message || 'Failed to delete account';
            toast.error(message);
        },
    });
}
