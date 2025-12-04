/**
 * Avatar utility functions for generating user avatars and group icons
 */

export const USER_AVATAR_STYLES = ['adventurer', 'adventurer-neutral', 'thumbs', 'fun-emoji'] as const;
export const GROUP_ICON_PROVIDERS = ['jdenticon'] as const;

export type UserAvatarStyle = (typeof USER_AVATAR_STYLES)[number];
export type GroupIconProvider = (typeof GROUP_ICON_PROVIDERS)[number];

/**
 * Generate a random seed for avatar/icon generation
 * @returns Random UUID-like string
 */
export function generateRandomSeed(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate DiceBear avatar URL
 * @param seed - Unique seed for avatar generation
 * @param style - Avatar style (rings, shapes, initials)
 * @returns DiceBear CDN URL
 */
export function generateDiceBearUrl(seed: string, style: UserAvatarStyle = 'adventurer'): string {
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Generate Jdenticon SVG string
 * @param seed - Unique seed for icon generation
 * @param size - Size of the icon in pixels (default: 40)
 * @returns SVG string
 */
export function generateJdenticonSvg(seed: string, size: number = 40): string {
    if (typeof window === 'undefined') return '';

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const jdenticon = require('jdenticon');
        return jdenticon.toSvg(seed, size);
    } catch {
        return '';
    }
}
