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
    TRANSACTIONS: '/transactions',
    ANALYTICS: '/analytics',
    BUDGET: '/budget',
    PROFILE: '/profile',

    // Feature routes
    SAVINGS: '/savings',
    SUBSCRIPTIONS: '/subscriptions',
    GROUPS: '/groups',
    LOANS: '/loans',
    TAGS: '/tags',
    PAYMENT_METHODS: '/payment-methods',
    ACCOUNTS: '/accounts',
    NOTIFICATIONS: '/notifications',

    // Settings
    SETTINGS: '/settings',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
