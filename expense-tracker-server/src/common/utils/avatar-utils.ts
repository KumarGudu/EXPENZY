/**
 * Avatar utility functions for generating and validating user avatars and group icons
 */

const ALLOWED_USER_AVATAR_STYLES = new Set(['adventurer', 'adventurer-neutral', 'thumbs', 'fun-emoji']);
const ALLOWED_GROUP_ICON_PROVIDERS = new Set(['jdenticon']);

/**
 * Generate DiceBear avatar URL
 * @param seed - Unique seed for avatar generation
 * @param style - Avatar style (rings, shapes, initials)
 * @returns DiceBear CDN URL
 */
export function generateDiceBearUrl(seed: string, style: string): string {
    const validStyle = ALLOWED_USER_AVATAR_STYLES.has(style) ? style : 'adventurer';
    return `https://api.dicebear.com/9.x/${validStyle}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Validate user avatar style
 * @param style - Style to validate
 * @returns true if valid, false otherwise
 */
export function validateUserAvatarStyle(style: string): boolean {
    return ALLOWED_USER_AVATAR_STYLES.has(style);
}

/**
 * Validate group icon provider
 * @param provider - Provider to validate
 * @returns true if valid, false otherwise
 */
export function validateGroupIconProvider(provider: string): boolean {
    return ALLOWED_GROUP_ICON_PROVIDERS.has(provider);
}

/**
 * Generate a random seed for avatar/icon generation
 * @returns Random UUID-like string
 */
export function generateRandomSeed(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
