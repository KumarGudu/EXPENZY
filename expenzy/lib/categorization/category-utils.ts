/**
 * Category utilities and constants
 * Centralized category management for the application
 */

import { CategoryType, CATEGORY_ICONS } from './category-icons';

/**
 * Get all category options for select dropdowns
 */
export function getCategoryOptions() {
    return Object.entries(CATEGORY_ICONS).map(([value, config]) => ({
        value: value as CategoryType,
        label: config.label,
        description: config.description,
        icon: config.icon,
        color: config.color,
    }));
}

/**
 * Format category for display
 */
export function formatCategory(category: string): string {
    const config = CATEGORY_ICONS[category as CategoryType];
    return config?.label || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Check if category is valid
 */
export function isValidCategory(category: string): category is CategoryType {
    return category in CATEGORY_ICONS;
}

/**
 * Get category from string (case-insensitive)
 */
export function normalizeCategory(category: string): CategoryType {
    const normalized = category.toLowerCase();
    return isValidCategory(normalized) ? normalized : 'other';
}
