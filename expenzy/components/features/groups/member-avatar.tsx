import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
    name: string;
    isSelected?: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showCheckmark?: boolean;
}

const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
};

export function MemberAvatar({
    name,
    isSelected = false,
    onClick,
    size = 'md',
    showCheckmark = true
}: MemberAvatarProps) {
    const initial = name.charAt(0).toUpperCase();

    return (
        <div
            onClick={onClick}
            className={cn(
                'relative rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0 transition-all',
                sizeClasses[size],
                onClick && 'cursor-pointer hover:scale-105',
                isSelected && showCheckmark && 'ring-2 ring-primary ring-offset-2'
            )}
        >
            {isSelected && showCheckmark ? (
                <div className="absolute inset-0 bg-primary/90 rounded-full flex items-center justify-center">
                    <Check className={cn(
                        'text-primary-foreground',
                        size === 'sm' && 'h-4 w-4',
                        size === 'md' && 'h-5 w-5',
                        size === 'lg' && 'h-6 w-6'
                    )} />
                </div>
            ) : (
                initial
            )}
        </div>
    );
}
