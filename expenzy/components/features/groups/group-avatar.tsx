import React from 'react';
import { GroupIcon } from '@/components/ui/group-icon';
import { cn } from '@/lib/utils/cn';

interface GroupAvatarProps {
    name: string;
    iconSeed?: string;
    iconProvider?: string;
    imageUrl?: string;
    icon?: 'home' | 'trip' | 'couple' | 'friends' | 'work' | 'shopping' | 'other';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
};

export const GroupAvatar: React.FC<GroupAvatarProps> = ({
    name,
    iconSeed,
    iconProvider,
    imageUrl,
    icon,
    size = 'md',
    className,
}) => {
    const sizeInPixels = sizeMap[size];

    return (
        <GroupIcon
            seed={iconSeed || name}
            provider={iconProvider as any}
            fallbackUrl={imageUrl}
            size={sizeInPixels}
            className={className}
        />
    );
};
