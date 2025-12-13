'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../api/endpoints';
import { apiClient } from '../api/client';

export interface Attachment {
    id: string;
    userId: string;
    entityType: string;
    entityId: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
    createdAt: string;
}

export function useAttachments(entityType: string, entityId: string) {
    return useQuery({
        queryKey: ['attachments', entityType, entityId],
        queryFn: async () => {
            return await apiClient.get<Attachment[]>(
                API_ENDPOINTS.ATTACHMENTS.BY_ENTITY(entityType, entityId)
            );
        },
        enabled: !!entityType && !!entityId,
    });
}

export function useUploadAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            file,
            entityType,
            entityId,
        }: {
            file: File;
            entityType: string;
            entityId: string;
        }) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post<Attachment>(
                `${API_ENDPOINTS.ATTACHMENTS.UPLOAD}?entityType=${entityType}&entityId=${entityId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['attachments', variables.entityType, variables.entityId],
            });
        },
    });
}

export function useDeleteAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(API_ENDPOINTS.ATTACHMENTS.DELETE(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attachments'] });
        },
    });
}
