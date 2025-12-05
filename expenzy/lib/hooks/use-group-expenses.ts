import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { toast } from 'sonner';
import type { GroupExpense, CreateExpenseData, UpdateExpenseData } from '@/types/split';

// Get all expenses for a group
export function useGroupExpenses(groupId: string) {
    return useQuery({
        queryKey: ['groups', groupId, 'expenses'],
        queryFn: async () => {
            const response = await apiClient.get<{ data: { groupExpenses: GroupExpense[] } }>(
                API_ENDPOINTS.GROUPS.BY_ID(groupId)
            );
            // Extract groupExpenses from nested structure
            return response.data?.groupExpenses || [];
        },
        enabled: !!groupId,
    });
}

// Get single expense
export function useGroupExpense(groupId: string, expenseId: string) {
    return useQuery({
        queryKey: ['groups', groupId, 'expenses', expenseId],
        queryFn: async () => {
            return await apiClient.get<GroupExpense>(
                API_ENDPOINTS.GROUPS.EXPENSE_BY_ID(groupId, expenseId)
            );
        },
        enabled: !!groupId && !!expenseId,
    });
}

// Create expense
export function useCreateGroupExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            data,
        }: {
            groupId: string;
            data: CreateExpenseData;
        }) => {
            return await apiClient.post<GroupExpense>(
                API_ENDPOINTS.GROUPS.EXPENSES(groupId),
                data
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'expenses'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'balances'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups'],
            });
            toast.success('Expense added successfully');
        },
        onError: (error: unknown) => {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add expense';
            toast.error(message);
        },
    });
}

// Update expense
export function useUpdateGroupExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            expenseId,
            data,
        }: {
            groupId: string;
            expenseId: string;
            data: UpdateExpenseData;
        }) => {
            return await apiClient.patch<GroupExpense>(
                API_ENDPOINTS.GROUPS.EXPENSE_BY_ID(groupId, expenseId),
                data
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'expenses'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'balances'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId],
            });
            toast.success('Expense updated successfully');
        },
        onError: (error: unknown) => {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update expense';
            toast.error(message);
        },
    });
}

// Delete expense
export function useDeleteGroupExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            expenseId,
        }: {
            groupId: string;
            expenseId: string;
        }) => {
            await apiClient.delete(
                API_ENDPOINTS.GROUPS.EXPENSE_BY_ID(groupId, expenseId)
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'expenses'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId, 'balances'],
            });
            queryClient.invalidateQueries({
                queryKey: ['groups', variables.groupId],
            });
            toast.success('Expense deleted successfully');
        },
        onError: (error: unknown) => {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete expense';
            toast.error(message);
        },
    });
}
