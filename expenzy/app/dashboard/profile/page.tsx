'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/hooks/use-profile';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { EditProfileModal } from '@/components/modals/edit-profile-modal';
import { ChangePasswordModal } from '@/components/modals/change-password-modal';
import { UserPreferencesModal } from '@/components/modals/user-preferences-modal';
import { DeleteAccountModal } from '@/components/modals/delete-account-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, LogOut, Settings, Bell, Shield, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

export default function ProfilePage() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { data: user, isLoading: userLoading } = useProfile();


    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'User';

    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            {/* User Info Card */}
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                            {initials}
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{displayName}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                        {user?.phone && (
                            <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
                        )}
                    </div>
                </div>
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => setIsEditProfileOpen(true)}
                >
                    Edit Profile
                </Button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
                {/* Appearance */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Appearance</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">
                                Choose your preferred color scheme
                            </p>
                        </div>
                        <Button
                            onClick={toggleTheme}
                            variant="outline"
                            className="capitalize"
                        >
                            {theme}
                        </Button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Preferences</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Currency</p>
                                <p className="text-sm text-muted-foreground">
                                    {user?.defaultCurrency || 'USD'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsPreferencesOpen(true)}
                            >
                                Manage
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsPreferencesOpen(true)}
                    >
                        Manage Notifications
                    </Button>
                </div>

                {/* Security */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Security</h3>
                    </div>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setIsChangePasswordOpen(true)}
                        >
                            Change Password
                        </Button>
                        {user?.lastPasswordChange && (
                            <p className="text-sm text-muted-foreground">
                                Last changed: {formatDate(user.lastPasswordChange)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-card border border-destructive/50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <h3 className="font-semibold text-destructive">Danger Zone</h3>
                    </div>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto ml-0 sm:ml-3"
                            onClick={() => setIsDeleteAccountOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal
                open={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
            <ChangePasswordModal
                open={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
            <UserPreferencesModal
                open={isPreferencesOpen}
                onClose={() => setIsPreferencesOpen(false)}
            />
            <DeleteAccountModal
                open={isDeleteAccountOpen}
                onClose={() => setIsDeleteAccountOpen(false)}
            />
        </div>
    );
}
