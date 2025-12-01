'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings, useUpdateSettings } from '@/lib/hooks/use-settings';
import { Palette, Bell, Download, Shield } from 'lucide-react';

interface UserPreferencesModalProps {
    open: boolean;
    onClose: () => void;
}

export function UserPreferencesModal({ open, onClose }: UserPreferencesModalProps) {
    const { data: settings, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    const handleToggle = async (key: string, value: boolean) => {
        await updateSettings.mutateAsync({ [key]: value });
    };

    if (isLoading) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User Preferences</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Appearance</h3>
                        </div>
                        <div className="space-y-3 pl-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Theme</p>
                                    <p className="text-sm text-muted-foreground">
                                        Current: {settings?.theme || 'light'}
                                    </p>
                                </div>
                                <select
                                    value={settings?.theme || 'light'}
                                    onChange={(e) =>
                                        updateSettings.mutateAsync({ theme: e.target.value as 'light' | 'dark' | 'system' })
                                    }
                                    className="px-3 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Time Format</p>
                                    <p className="text-sm text-muted-foreground">
                                        Current: {settings?.timeFormat || '24h'}
                                    </p>
                                </div>
                                <select
                                    value={settings?.timeFormat || '24h'}
                                    onChange={(e) =>
                                        updateSettings.mutateAsync({ timeFormat: e.target.value as '12h' | '24h' })
                                    }
                                    className="px-3 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="12h">12-hour</option>
                                    <option value="24h">24-hour</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="space-y-3 pl-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.emailNotifications ?? true}
                                    onCheckedChange={(checked) =>
                                        handleToggle('emailNotifications', checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.pushNotifications ?? true}
                                    onCheckedChange={(checked) =>
                                        handleToggle('pushNotifications', checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Budget Alerts</p>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when exceeding budget limits
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.budgetAlerts ?? true}
                                    onCheckedChange={(checked) =>
                                        handleToggle('budgetAlerts', checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Subscription Reminders</p>
                                    <p className="text-sm text-muted-foreground">
                                        Remind about upcoming subscriptions
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.subscriptionReminders ?? true}
                                    onCheckedChange={(checked) =>
                                        handleToggle('subscriptionReminders', checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Loan Reminders</p>
                                    <p className="text-sm text-muted-foreground">
                                        Remind about loan payments
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.loanReminders ?? true}
                                    onCheckedChange={(checked) =>
                                        handleToggle('loanReminders', checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data & Privacy Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Download className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Data & Privacy</h3>
                        </div>
                        <div className="space-y-3 pl-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Export Format</p>
                                    <p className="text-sm text-muted-foreground">
                                        Default format for data exports
                                    </p>
                                </div>
                                <select
                                    value={settings?.exportFormat || 'pdf'}
                                    onChange={(e) =>
                                        updateSettings.mutateAsync({
                                            exportFormat: e.target.value as 'pdf' | 'csv' | 'excel',
                                        })
                                    }
                                    className="px-3 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="csv">CSV</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Auto Backup</p>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically backup your data
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.autoBackup ?? false}
                                    onCheckedChange={(checked) =>
                                        handleToggle('autoBackup', checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
