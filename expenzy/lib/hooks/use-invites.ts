import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { toast } from 'sonner';

export enum InviteStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export enum InviteType {
    GROUP = 'group',
}

export interface InviteDetails {
    type: InviteType;
    status: InviteStatus;
    invitedAt: string;
    isExpired: boolean;
    entityId: string;
    entityDetails: {
        groupId: string;
        groupName: string;
        description?: string;
        memberCount: number;
        role: 'admin' | 'member';
        createdBy: {
            id: string;
            username: string;
            email: string;
        };
    };
}

export function useInviteDetails(token: string) {
    return useQuery({
        queryKey: ['invites', token],
        queryFn: async () => {
            return await apiClient.get<InviteDetails>(API_ENDPOINTS.INVITES.BY_TOKEN(token));
        },
        enabled: !!token,
        retry: false,
    });
}

export function useAcceptInvite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (token: string) => {
            return await apiClient.post(API_ENDPOINTS.INVITES.ACCEPT(token), {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['invites'] });
            toast.success('Joined group successfully!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to join group';
            toast.error(message);
        },
    });
}
