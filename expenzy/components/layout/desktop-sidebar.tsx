'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils/cn';
import { LogOut, LayoutDashboard, Receipt, BarChart3, Wallet, User } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const navigation = [
    { name: 'Dashboard', route: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Transactions', route: ROUTES.TRANSACTIONS, icon: Receipt },
    { name: 'Analytics', route: ROUTES.ANALYTICS, icon: BarChart3 },
    { name: 'Budget', route: ROUTES.BUDGET, icon: Wallet },
    { name: 'Profile', route: ROUTES.PROFILE, icon: User },
];

export function DesktopSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    return (
        <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:border-r md:border-border md:bg-card">
            {/* Logo */}
            <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold">
                    E
                </div>
                <span className="text-xl font-bold">Expenzy</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.route;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.route}
                            onClick={() => router.push(item.route)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 mt-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
