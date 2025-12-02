
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { QUERY_KEYS } from '@/lib/config/query-client';
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from '@/types/expense';
import { toast } from 'sonner';

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}



export function useExpenses(
    filters?: ExpenseFilters & { page?: number; limit?: number },
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ['expenses', filters],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();

            // Handle pagination
            const page = filters?.page || pageParam || 1;
            const limit = filters?.limit || 10;

            params.append('page', page.toString());
            params.append('limit', limit.toString());

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
                        params.append(key, value.toString());
                    }
                });
            }

            const url = `${API_ENDPOINTS.EXPENSES.BASE}?${params.toString()}`;

            // Use getRaw to get the full PaginatedResponse structure directly
            // The backend returns { data: [...], meta: {...} } which matches PaginatedResponse
            const response = await apiClient.getRaw<PaginatedResponse<Expense>>(url);

            return response;
        },
        enabled: options?.enabled,
    });
}

export function useExpense(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.EXPENSES.DETAIL(id),
        queryFn: () => apiClient.get<Expense>(API_ENDPOINTS.EXPENSES.BY_ID(id)),
        enabled: !!id,
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseDto) =>
            apiClient.post<Expense>(API_ENDPOINTS.EXPENSES.BASE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD() });
            toast.success('Expense created successfully');
        },
        onError: (error: { message: string }) => {
            toast.error(error.message || 'Failed to create expense');
        },
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
            apiClient.patch<Expense>(API_ENDPOINTS.EXPENSES.BY_ID(id), data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.DETAIL(variables.id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD() });
            toast.success('Expense updated successfully');
        },
        onError: (error: { message: string }) => {
            toast.error(error.message || 'Failed to update expense');
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete(API_ENDPOINTS.EXPENSES.BY_ID(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD() });
            toast.success('Expense deleted successfully');
        },
        onError: (error: { message: string }) => {
            toast.error(error.message || 'Failed to delete expense');
        },
    });
}
