/**
 * Centralized route definitions for the application
 */

export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',

    // Dashboard routes
    DASHBOARD: '/dashboard',
    TRANSACTIONS: '/dashboard/transactions',
    ANALYTICS: '/dashboard/analytics',
    BUDGET: '/dashboard/budget',
    PROFILE: '/dashboard/profile',

    // Feature routes
    SAVINGS: '/dashboard/savings',
    SUBSCRIPTIONS: '/dashboard/subscriptions',
    GROUPS: '/dashboard/groups',
    LOANS: '/dashboard/loans',
    TAGS: '/dashboard/tags',
    PAYMENT_METHODS: '/dashboard/payment-methods',
    ACCOUNTS: '/dashboard/accounts',
    NOTIFICATIONS: '/dashboard/notifications',

    // Settings
    SETTINGS: '/dashboard/settings',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
