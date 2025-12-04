'use client';

import { Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import type { User } from '@/types/user';

interface ProfileHeaderProps {
    user: User | undefined;
    onEditProfile: () => void;
}

export function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'User';

    return (
        <div className="rounded-xl bg-card border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <UserAvatar
                    seed={user?.avatarSeed}
                    style={user?.avatarStyle as 'adventurer' | 'adventurer-neutral' | 'thumbs' | 'fun-emoji' | undefined}
                    fallbackUrl={user?.avatar}
                    size={96}
                    className="ring-2 ring-primary/20"
                />
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">{displayName}</h2>
                    <div className="space-y-1 text-muted-foreground">
                        <p className="flex items-center gap-2 justify-center md:justify-start">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </p>
                        {user?.phone && (
                            <p className="flex items-center gap-2 justify-center md:justify-start">
                                <Smartphone className="w-4 h-4" />
                                {user.phone}
                            </p>
                        )}
                    </div>
                    <Button className="mt-4" onClick={onEditProfile}>
                        Edit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
