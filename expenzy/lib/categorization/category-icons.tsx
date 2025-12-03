/**
 * Category Icon Mappings using Lucide React Icons
 * 
 * Maps each expense category to a corresponding Lucide icon
 * Use these instead of emojis for better UI consistency
 */

import {
    UtensilsCrossed,
    ShoppingCart,
    Car,
    ShoppingBag,
    Pill,
    Zap,
    Tv,
    Home,
    GraduationCap,
    Dumbbell,
    Shield,
    TrendingUp,
    PawPrint,
    HelpCircle,
    type LucideIcon,
} from 'lucide-react';

export type CategoryType =
    | 'food'
    | 'groceries'
    | 'travel'
    | 'shopping'
    | 'medicine'
    | 'bills'
    | 'entertainment'
    | 'housing'
    | 'education'
    | 'fitness'
    | 'insurance'
    | 'investment'
    | 'pets'
    | 'other';

export interface CategoryConfig {
    icon: LucideIcon;
    color: string; // Tailwind color class
    label: string;
    description: string;
}

export const CATEGORY_ICONS: Record<CategoryType, CategoryConfig> = {
    food: {
        icon: UtensilsCrossed,
        color: 'text-orange-500',
        label: 'Food & Dining',
        description: 'Restaurants, food delivery, dining out',
    },
    groceries: {
        icon: ShoppingCart,
        color: 'text-green-500',
        label: 'Groceries',
        description: 'Supermarkets, vegetables, fruits, daily essentials',
    },
    travel: {
        icon: Car,
        color: 'text-blue-500',
        label: 'Travel & Transport',
        description: 'Uber, Ola, petrol, flights, parking',
    },
    shopping: {
        icon: ShoppingBag,
        color: 'text-purple-500',
        label: 'Shopping',
        description: 'Online shopping, clothes, electronics',
    },
    medicine: {
        icon: Pill,
        color: 'text-red-500',
        label: 'Health & Medicine',
        description: 'Pharmacy, hospital, doctor visits',
    },
    bills: {
        icon: Zap,
        color: 'text-yellow-500',
        label: 'Bills & Utilities',
        description: 'Electricity, WiFi, mobile recharge',
    },
    entertainment: {
        icon: Tv,
        color: 'text-pink-500',
        label: 'Entertainment',
        description: 'Movies, Netflix, Spotify, concerts',
    },
    housing: {
        icon: Home,
        color: 'text-indigo-500',
        label: 'Housing',
        description: 'Rent, maintenance, repairs',
    },
    education: {
        icon: GraduationCap,
        color: 'text-cyan-500',
        label: 'Education',
        description: 'Tuition, courses, books, certifications',
    },
    fitness: {
        icon: Dumbbell,
        color: 'text-emerald-500',
        label: 'Fitness & Sports',
        description: 'Gym, yoga, sports equipment',
    },
    insurance: {
        icon: Shield,
        color: 'text-slate-500',
        label: 'Insurance',
        description: 'Health, life, vehicle insurance',
    },
    investment: {
        icon: TrendingUp,
        color: 'text-teal-500',
        label: 'Investment',
        description: 'Mutual funds, stocks, SIP',
    },
    pets: {
        icon: PawPrint,
        color: 'text-amber-500',
        label: 'Pets',
        description: 'Pet food, vet, grooming',
    },
    other: {
        icon: HelpCircle,
        color: 'text-gray-500',
        label: 'Other',
        description: 'Miscellaneous expenses',
    },
};

/**
 * Get icon component for a category
 */
export function getCategoryIcon(category: CategoryType): LucideIcon {
    return CATEGORY_ICONS[category]?.icon || HelpCircle;
}

/**
 * Get color class for a category
 */
export function getCategoryColor(category: CategoryType): string {
    return CATEGORY_ICONS[category]?.color || 'text-gray-500';
}

/**
 * Get label for a category
 */
export function getCategoryLabel(category: CategoryType): string {
    return CATEGORY_ICONS[category]?.label || 'Other';
}

/**
 * Get description for a category
 */
export function getCategoryDescription(category: CategoryType): string {
    return CATEGORY_ICONS[category]?.description || 'Miscellaneous expenses';
}

/**
 * Get all categories as array
 */
export function getAllCategories(): CategoryType[] {
    return Object.keys(CATEGORY_ICONS) as CategoryType[];
}

/**
 * Component to render category icon with color
 */
export function CategoryIcon({
    category,
    className = "h-5 w-5"
}: {
    category: CategoryType;
    className?: string;
}) {
    const Icon = getCategoryIcon(category);
    const color = getCategoryColor(category);

    return <Icon className={`${className} ${color}`} />;
}

/**
 * Component to render category badge with icon
 */
export function CategoryBadge({
    category,
    showLabel = true,
}: {
    category: CategoryType;
    showLabel?: boolean;
}) {
    const Icon = getCategoryIcon(category);
    const color = getCategoryColor(category);
    const label = getCategoryLabel(category);

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50">
            <Icon className={`h-4 w-4 ${color}`} />
            {showLabel && (
                <span className="text-sm font-medium">{label}</span>
            )}
        </div>
    );
}
