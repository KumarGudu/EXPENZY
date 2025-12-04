'use client';

import { generateDiceBearUrl, UserAvatarStyle } from '@/lib/utils/avatar-utils';
import Image from 'next/image';

interface UserAvatarProps {
    seed?: string;
    style?: UserAvatarStyle;
    size?: number;
    fallbackUrl?: string | null;
    className?: string;
}

/**
 * UserAvatar component - displays DiceBear avatar with fallback support
 */
export function UserAvatar({
    seed,
    style = 'rings',
    size = 40,
    fallbackUrl,
    className = '',
}: UserAvatarProps) {
    // Use fallback if no seed provided
    const avatarUrl = seed ? generateDiceBearUrl(seed, style) : fallbackUrl;

    if (!avatarUrl) {
        // Default fallback - use a placeholder
        return (
            <div
                className={`rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <span className="text-white font-semibold" style={{ fontSize: size / 2.5 }}>
                    ?
                </span>
            </div>
        );
    }

    return (
        <div className={`rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
            <Image
                src={avatarUrl}
                alt="User avatar"
                width={size}
                height={size}
                className="w-full h-full object-cover"
                unoptimized // DiceBear SVGs don't need optimization
            />
        </div>
    );
}
