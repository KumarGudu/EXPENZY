/**
 * Frontend Keyword Matcher for Instant Categorization
 * 
 * This provides instant category suggestions as users type,
 * using a local keyword dictionary (no backend calls needed).
 */

import React from 'react';
import { matchCategory, getCategories } from './keyword-dictionary';

export class KeywordMatcher {
    /**
     * Match description to category
     * Returns category name or null if no match
     */
    match(description: string): string | null {
        return matchCategory(description);
    }

    /**
     * Check if matcher is ready (always true for local matching)
     */
    isReady(): boolean {
        return true;
    }
}

// Singleton instance
let keywordMatcherInstance: KeywordMatcher | null = null;

/**
 * Get the singleton keyword matcher instance
 */
export function getKeywordMatcher(): KeywordMatcher {
    if (!keywordMatcherInstance) {
        keywordMatcherInstance = new KeywordMatcher();
    }
    return keywordMatcherInstance;
}

/**
 * React hook for using keyword matcher
 */
export function useKeywordMatcher() {
    const matcher = getKeywordMatcher();
    const [isReady] = React.useState(true); // Always ready with local dictionary

    return {
        match: (description: string) => matcher.match(description),
        isReady,
        getCategories: () => getCategories(),
    };
}
