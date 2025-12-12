'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadAttachment, useAttachments, useDeleteAttachment, type Attachment } from '@/lib/hooks/use-attachments';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    entityType: 'expense' | 'group_expense' | 'income';
    entityId: string;
    maxSize?: number; // in MB
}

export function FileUpload({ entityType, entityId, maxSize = 10 }: FileUploadProps) {
    const uploadAttachment = useUploadAttachment();
    const { data: attachments, isLoading } = useAttachments(entityType, entityId);
    const deleteAttachment = useDeleteAttachment();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                try {
                    await uploadAttachment.mutateAsync({
                        file,
                        entityType,
                        entityId,
                    });
                } catch (error) {
                    console.error('Failed to upload file:', error);
                }
            }
        },
        [uploadAttachment, entityType, entityId]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: maxSize * 1024 * 1024,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
    });

    const getFileIcon = (mimeType?: string) => {
        if (!mimeType) return <File className="h-8 w-8" />;
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
        if (mimeType === 'application/pdf') return <FileText className="h-8 w-8" />;
        return <File className="h-8 w-8" />;
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const mb = bytes / (1024 * 1024);
        if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                {isDragActive ? (
                    <p className="text-sm text-primary font-medium">Drop files here...</p>
                ) : (
                    <div>
                        <p className="text-sm font-medium mb-1">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Images, PDF, or text files (max {maxSize}MB)
                        </p>
                    </div>
                )}
            </div>

            {/* Uploaded Files List */}
            {isLoading ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    Loading attachments...
                </div>
            ) : attachments && attachments.length > 0 ? (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Attached Files ({attachments.length})</h4>
                    <div className="space-y-2">
                        {attachments.map((attachment: Attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="text-muted-foreground">
                                    {getFileIcon(attachment.mimeType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(attachment.fileSize)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteAttachment.mutate(attachment.id)}
                                    disabled={deleteAttachment.isPending}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    No files attached yet
                </div>
            )}

            {/* Upload Progress */}
            {uploadAttachment.isPending && (
                <div className="text-center py-2">
                    <p className="text-sm text-primary">Uploading...</p>
                </div>
            )}
        </div>
    );
}
