/**
 * Frontend Keyword Dictionary for Category Auto-Detection
 * 
 * This provides instant category matching without backend calls.
 * Keywords are matched case-insensitively against transaction descriptions.
 * 
 * OPTIMIZATION STRATEGY:
 * 1. Multi-word phrases are checked first (substring match).
 * 2. Single words are checked via a Map lookup (O(1)) for exact matches.
 * 3. This ensures "scarf" doesn't match "car", but "ice cream" is detected correctly.
 */

export const KEYWORD_DICTIONARY: Record<string, string[]> = {
    // =================================================================
    // FOOD & DINING
    // =================================================================
    food: [
        // Raw Ingredients & Groceries
        'potato', 'tomato', 'onion', 'garlic', 'ginger', 'chilli', 'pepper',
        'vegetable', 'fruit', 'apple', 'banana', 'orange', 'grape', 'mango',
        'rice', 'wheat', 'flour', 'atta', 'maida', 'suji', 'dal', 'pulse', 'lentil',
        'milk', 'curd', 'yogurt', 'paneer', 'cheese', 'butter', 'ghee', 'cream',
        'oil', 'mustard oil', 'olive oil', 'sunflower oil', 'coconut oil',
        'salt', 'sugar', 'spice', 'masala', 'turmeric', 'cumin', 'coriander',
        'chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'seafood', 'prawn', 'egg',
        'bread', 'bun', 'toast', 'bakery', 'cake', 'pastry', 'muffin', 'cookie', 'biscuit',
        'snack', 'chips', 'nachos', 'popcorn', 'chocolate', 'candy', 'sweet', 'dessert',
        'ice cream', 'gelato', 'sorbet', 'kulfi', 'falooda',
        'tea', 'coffee', 'chai', 'latte', 'cappuccino', 'espresso', 'mocha',
        'juice', 'soda', 'coke', 'pepsi', 'sprite', 'fanta', 'water', 'bisleri', 'aquafina',
        'bituya', 'bituya meals', // Specific user request

        // Dishes & Meals
        'lunch', 'dinner', 'breakfast', 'brunch', 'supper', 'meal', 'tiffin',
        'thali', 'platter', 'combo', 'buffet',
        'pizza', 'burger', 'sandwich', 'sub', 'wrap', 'taco', 'burrito', 'quesadilla',
        'pasta', 'spaghetti', 'macaroni', 'lasagna', 'noodle', 'chowmein', 'ramen', 'sushi',
        'salad', 'soup', 'stew', 'curry', 'gravy',
        'steak', 'ribs', 'bbq', 'grill', 'roast', 'fried',
        'biryani', 'pulao', 'khichdi', 'roti', 'naan', 'paratha', 'chapati', 'kulcha',
        'dosa', 'idli', 'vada', 'sambar', 'uttapam', 'upma', 'poha',
        'samosa', 'kachori', 'pakora', 'bhajiya', 'momos', 'dumpling', 'spring roll',
        'manchurian', 'fried rice', 'chilli chicken',
        'kebab', 'tikka', 'shawarma', 'falafel', 'hummus', 'pita',
    ],
    dining_out: [
        // Places
        'restaurant', 'cafe', 'cafeteria', 'bistro', 'diner', 'eatery', 'mess', 'canteen',
        'bar', 'pub', 'club', 'lounge', 'brewery', 'winery',
        'food court', 'drive thru', 'takeout', 'delivery',

        // Brands
        'mcdonald', 'kfc', 'burger king', 'subway', 'dominos', 'pizza hut', 'papa johns',
        'starbucks', 'costa coffee', 'dunkin', 'tim hortons', 'barista', 'ccd',
        'taco bell', 'wendys', 'chipotle', 'nandos', 'chilis', 'tgi fridays',
        'zomato', 'swiggy', 'uber eats', 'doordash', 'grubhub', 'postmates', 'foodpanda',
        'blinkit', 'zepto', 'instamart' // Quick commerce often used for food/snacks
    ],
    groceries: [
        'grocery', 'supermarket', 'hypermarket', 'mart', 'store', 'market', 'bazaar',
        'walmart', 'target', 'costco', 'whole foods', 'trader joes', 'aldi', 'lidl',
        'dmart', 'big bazaar', 'reliance fresh', 'more', 'spencers', 'nature basket',
        '7 eleven', 'walgreens', 'cvs', 'rite aid',
        'vegetables', 'fruits', 'provisions', 'ration'
    ],

    // =================================================================
    // TRANSPORTATION & AUTO
    // =================================================================
    fuel: [
        'fuel', 'petrol', 'diesel', 'gasoline', 'gas station', 'pump',
        'cng', 'lpg', 'autogas', // Specific user request
        'shell', 'bp', 'exxon', 'chevron', 'total', 'esso', 'mobil', 'texaco',
        'indian oil', 'bharat petroleum', 'hp', 'nayara', 'reliance petrol'
    ],
    transport: [
        // Ride Hailing
        'uber', 'lyft', 'ola', 'rapido', 'grab', 'bolt', 'gojek', 'careem',
        'taxi', 'cab', 'auto', 'rickshaw', 'tuk tuk',

        // Public Transport
        'bus', 'train', 'metro', 'subway', 'tube', 'tram', 'monorail',
        'ticket', 'pass', 'card recharge', 'clipper', 'oyster',
        'irctc', 'amtrak', 'eurail', 'greyhound',

        // Personal Vehicle Expenses
        'parking', 'toll', 'fastag', 'challan', 'fine',
        'mechanic', 'garage', 'service center', 'workshop',
        'car repair', 'bike repair', 'scooter repair', // Specific user request
        'car wash', 'bike wash', 'cleaning', 'detailing', // Specific user request
        'puncture', 'tyre', 'tire', 'alignment', 'balancing', 'rotation',
        'oil change', 'battery', 'wiper', 'brake', 'clutch', 'gear', 'engine',
        'spare part', 'accessory', 'helmet'
    ],
    travel: [
        'flight', 'airline', 'airfare', 'ticket', 'boarding',
        'airport', 'lounge', 'baggage', 'visa', 'passport',
        'hotel', 'motel', 'resort', 'inn', 'stay', 'accommodation',
        'airbnb', 'booking.com', 'agoda', 'expedia', 'makemytrip', 'cleartrip', 'goibibo',
        'vacation', 'trip', 'tour', 'holiday', 'sightseeing', 'guide',
        'delta', 'united', 'american airlines', 'emirates', 'qatar', 'lufthansa',
        'indigo', 'air india', 'vistara', 'spicejet', 'akasa'
    ],

    // =================================================================
    // BILLS & UTILITIES
    // =================================================================
    utilities: [
        'electricity', 'power', 'electric', 'current', 'bescom', 'tata power', 'adani power',
        'water', 'water bill', 'sewage', 'municipal',
        'gas bill', 'piped gas', 'cylinder', 'indane', 'bharat gas', 'hp gas',
        'internet', 'wifi', 'broadband', 'fiber', 'act', 'jio fiber', 'airtel xstream',
        'mobile', 'phone', 'prepaid', 'postpaid', 'recharge', 'topup',
        'airtel', 'jio', 'vi', 'vodafone', 'idea', 'bsnl', 'verizon', 'at&t', 't-mobile'
    ],
    subscriptions: [
        // Streaming (Video)
        'netflix', 'prime video', 'youtube', 'hulu', 'disney', 'hbo', 'max',
        'peacock', 'paramount', 'crunchyroll', 'funimation', 'hotstar', 'sonyliv', 'zee5',
        'jiocinema', 'voot', 'aha', 'hoichoi',

        // Streaming (Audio)
        'spotify', 'apple music', 'amazon music', 'youtube music', 'tidal', 'deezer',
        'pandora', 'soundcloud', 'audible', 'storytel', 'pocket fm', 'kuuku fm',

        // Software & Apps
        'google one', 'icloud', 'dropbox', 'onedrive', 'box',
        'adobe', 'photoshop', 'illustrator', 'creative cloud',
        'microsoft 365', 'office 365', 'canva', 'figma', 'notion', 'evernote',
        'chatgpt', 'midjourney', 'claude', 'gemini', 'copilot', 'openai', 'anthropic',
        'vpn', 'nordvpn', 'expressvpn', 'surfshark', 'proton',
        'antivirus', 'norton', 'mcafee', 'kaspersky', 'bitdefender', 'malwarebytes',
        'password manager', 'lastpass', '1password', 'dashlane', 'bitwarden',

        // News & Reading
        'medium', 'substack', 'patreon', 'onlyfans', 'twitch', 'discord', 'nitro',
        'nytimes', 'washington post', 'wsj', 'economist', 'bloomberg',
        'kindle', 'books', 'magazines'
    ],
    rent: [
        'rent', 'rental', 'lease', 'deposit', 'maintenance charge',
        'landlord', 'brokerage', 'house rent', 'shop rent', 'office rent'
    ],

    // =================================================================
    // SHOPPING & LIFESTYLE
    // =================================================================
    shopping: [
        'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa', 'tatacliq',
        'ebay', 'etsy', 'aliexpress', 'temu', 'shein',
        'shopping', 'purchase', 'buy', 'bought', 'order',
        'mall', 'outlet', 'store', 'shop', 'boutique',
        'clothes', 'apparel', 'fashion', 'dress', 'shirt', 'pant', 'jeans', 'tshirt',
        'shoe', 'sneaker', 'sandal', 'boot', 'footwear', 'nike', 'adidas', 'puma', 'reebok',
        'bag', 'purse', 'wallet', 'backpack', 'luggage',
        'watch', 'sunglasses', 'jewelry', 'ring', 'necklace', 'earring'
    ],
    electronics: [
        'laptop', 'computer', 'desktop', 'monitor', 'keyboard', 'mouse',
        'phone', 'mobile', 'smartphone', 'iphone', 'android', 'samsung', 'pixel', 'oneplus',
        'tablet', 'ipad', 'kindle',
        'headphone', 'earphone', 'airpods', 'buds', 'speaker', 'bluetooth',
        'camera', 'lens', 'tripod', 'gopro', 'drone',
        'charger', 'cable', 'power bank', 'adapter', 'case', 'cover', 'screen guard',
        'tv', 'television', 'smart tv', 'projector',
        'printer', 'scanner', 'ink', 'cartridge',
        'apple', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'sony', 'lg', 'bose', 'jbl'
    ],
    personal_care: [
        'salon', 'parlour', 'spa', 'barber', 'haircut', 'shave', 'trim',
        'facial', 'massage', 'manicure', 'pedicure', 'waxing', 'threading',
        'makeup', 'cosmetics', 'lipstick', 'foundation', 'perfume', 'deodorant',
        'shampoo', 'conditioner', 'soap', 'body wash', 'face wash', 'lotion', 'cream',
        'razor', 'blade', 'shaving cream', 'sanitary', 'pad', 'tampon',
        'beauty', 'grooming', 'skin care', 'hair care'
    ],

    // =================================================================
    // HEALTH & FITNESS
    // =================================================================
    health: [
        'doctor', 'physician', 'specialist', 'dentist', 'consultation', 'fee',
        'hospital', 'clinic', 'nursing home', 'emergency', 'ambulance',
        'medicine', 'drug', 'tablet', 'syrup', 'injection', 'vaccine',
        'pharmacy', 'chemist', 'medical store', 'apollo', '1mg', 'pharmeasy', 'netmeds',
        'test', 'lab', 'blood test', 'xray', 'scan', 'mri', 'ct scan', 'ultrasound',
        'checkup', 'diagnosis', 'treatment', 'surgery', 'operation',
        'glasses', 'spectacles', 'lens', 'contact lens', 'eye test'
    ],
    fitness_sports: [
        'gym', 'fitness', 'workout', 'exercise', 'training', 'crossfit', 'pilates', 'zumba',
        'yoga', 'meditation',
        'membership', 'subscription', 'trainer', 'coach',
        'sports', 'cricket', 'football', 'soccer', 'tennis', 'badminton', 'basketball',
        'swimming', 'pool', 'golf', 'bowling',
        'equipment', 'gear', 'jersey', 'racket', 'bat', 'ball',
        'decathlon', 'nike', 'adidas', 'under armour', 'puma',
        'protein', 'supplement', 'creatine', 'whey', 'vitamins'
    ],

    // =================================================================
    // ENTERTAINMENT & LEISURE
    // =================================================================
    entertainment: [
        'movie', 'cinema', 'theater', 'film', 'imax', 'pvr', 'inox', 'cinepolis',
        'ticket', 'show', 'concert', 'gig', 'performance', 'play', 'drama', 'comedy',
        'game', 'gaming', 'video game', 'console', 'ps5', 'ps4', 'xbox', 'nintendo', 'switch',
        'steam', 'epic games', 'playstation', 'riot', 'valorant', 'league of legends',
        'bowling', 'arcade', 'amusement park', 'theme park', 'water park',
        'museum', 'zoo', 'aquarium', 'exhibition', 'gallery',
        'club', 'disco', 'nightclub', 'entry fee', 'cover charge',
        'betting', 'casino', 'lottery'
    ],
    events: [
        'party', 'birthday', 'anniversary', 'wedding', 'engagement', 'reception',
        'festival', 'diwali', 'christmas', 'eid', 'holi', 'new year',
        'gift', 'present', 'envelope', 'shagun',
        'decoration', 'balloon', 'cake', 'catering',
        'conference', 'seminar', 'workshop', 'meetup'
    ],

    // =================================================================
    // HOME & LIVING
    // =================================================================
    home: [
        'furniture', 'sofa', 'bed', 'table', 'chair', 'desk', 'wardrobe', 'cabinet',
        'decor', 'curtain', 'carpet', 'rug', 'cushion', 'pillow', 'sheet', 'blanket',
        'appliance', 'fridge', 'refrigerator', 'washing machine', 'ac', 'air conditioner',
        'microwave', 'oven', 'stove', 'chimney', 'fan', 'light', 'bulb', 'tube',
        'kitchen', 'utensil', 'cooker', 'pan', 'pot', 'crockery', 'cutlery',
        'ikea', 'home depot', 'urban ladder', 'pepperfry', 'home centre',
        'garden', 'plant', 'pot', 'soil', 'fertilizer', 'nursery'
    ],
    repairs_maintenance: [
        'repair', 'fix', 'service', 'maintenance', 'amc',
        'plumber', 'electrician', 'carpenter', 'painter', 'mason', 'handyman',
        'cleaning', 'maid', 'servant', 'cook', 'gardener', 'driver', 'security',
        'urban company', 'housejoy',
        'pest control', 'termite',
        'hardware', 'paint', 'cement', 'tool', 'drill', 'hammer', 'screwdriver'
    ],

    // =================================================================
    // FINANCIAL & OTHERS
    // =================================================================
    insurance: [
        'insurance', 'policy', 'premium', 'renewal',
        'life insurance', 'term insurance', 'lic',
        'health insurance', 'mediclaim', 'star health', 'hdfc ergo',
        'car insurance', 'bike insurance', 'vehicle insurance', 'acko', 'digit'
    ],
    taxes: [
        'tax', 'gst', 'vat', 'tds', 'income tax', 'property tax', 'road tax',
        'filing', 'return', 'audit', 'ca', 'accountant', 'irs'
    ],
    loans_credit: [
        'loan', 'emi', 'installment', 'repayment',
        'credit card', 'bill payment', 'interest', 'finance charge',
        'mortgage', 'home loan', 'car loan', 'personal loan', 'education loan',
        'bajaj finserv', 'home credit'
    ],
    investments: [
        'investment', 'invest', 'stock', 'share', 'equity', 'mutual fund', 'sip',
        'bond', 'debenture', 'fd', 'rd', 'fixed deposit',
        'gold', 'silver', 'bullion', 'coin', 'jewellery',
        'crypto', 'bitcoin', 'ethereum', 'binance', 'coinbase',
        'zerodha', 'groww', 'upstox', 'angel one', 'smallcase', 'indmoney',
        'trading', 'demat', 'brokerage'
    ],
    education: [
        'school', 'college', 'university', 'institute', 'academy',
        'fee', 'tuition', 'admission', 'donation',
        'course', 'class', 'training', 'coaching', 'certification', 'bootcamp',
        'udemy', 'coursera', 'edx', 'skillshare', 'pluralsight', 'codecademy',
        'book', 'textbook', 'notebook', 'stationery', 'pen', 'pencil', 'uniform',
        'exam', 'test fee', 'registration'
    ],
    kids_family: [
        'baby', 'kid', 'child', 'children', 'son', 'daughter',
        'diaper', 'wipes', 'formula', 'cerelac', 'milk',
        'toy', 'doll', 'game', 'lego',
        'school', 'daycare', 'creche', 'nanny', 'babysitter',
        'pocket money', 'allowance'
    ],
    pets: [
        'pet', 'dog', 'cat', 'puppy', 'kitten', 'bird', 'fish',
        'food', 'pedigree', 'whiskas', 'royal canin', 'drools',
        'vet', 'veterinary', 'vaccination', 'deworming',
        'grooming', 'shampoo', 'leash', 'collar', 'toy', 'bed', 'cage', 'aquarium'
    ],
    charity: [
        'donation', 'charity', 'alms', 'beggar',
        'ngo', 'foundation', 'trust', 'temple', 'church', 'mosque', 'gurudwara',
        'offering', 'tithe', 'zakat', 'dakshina',
        'crowdfunding', 'ketto', 'milaap', 'gofundme'
    ],
    business_work: [
        'office', 'work', 'business', 'startup', 'freelance',
        'client', 'meeting', 'lunch', 'dinner',
        'software', 'tool', 'hosting', 'domain',
        'stationery', 'printing', 'xerox', 'courier', 'postage',
        'salary', 'wages', 'bonus', 'incentive'
    ]
};

// =================================================================
// OPTIMIZED MATCHING LOGIC
// =================================================================

// 1. Inverted Index for O(1) exact word lookup
const WORD_TO_CATEGORY = new Map<string, string>();

// 2. List of multi-word phrases for substring matching
const PHRASES: { phrase: string, category: string }[] = [];

// Initialization: Process the dictionary once
(function initializeMatcher() {
    for (const [category, keywords] of Object.entries(KEYWORD_DICTIONARY)) {
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();

            if (lowerKeyword.includes(' ')) {
                // It's a phrase (e.g., "ice cream")
                PHRASES.push({ phrase: lowerKeyword, category });
            } else {
                // It's a single word
                // If a word appears in multiple categories, the last one wins (or we could handle priority)
                // For now, we assume the dictionary order is roughly priority or distinct enough
                WORD_TO_CATEGORY.set(lowerKeyword, category);
            }
        }
    }

    // Sort phrases by length (descending) to match longest phrases first
    // e.g., match "amazon prime" before "amazon"
    PHRASES.sort((a, b) => b.phrase.length - a.phrase.length);
})();

/**
 * Match a description to a category using optimized logic
 * 
 * Performance: < 1ms typically
 */
export function matchCategory(description: string): string | null {
    if (!description) return null;

    const normalized = description.toLowerCase().trim();

    // 1. Check multi-word phrases first (Substring Match)
    // This handles "ice cream", "burger king", "car wash"
    for (const { phrase, category } of PHRASES) {
        if (normalized.includes(phrase)) {
            return category;
        }
    }

    // 2. Tokenize and check exact words (Exact Word Match)
    // This handles "uber", "pizza", "apple"
    // Splitting by common delimiters
    const words = normalized.split(/[\s,.-]+/);

    for (const word of words) {
        if (WORD_TO_CATEGORY.has(word)) {
            return WORD_TO_CATEGORY.get(word)!;
        }
    }

    // 3. Fallback: Check if any single keyword is a substring of the description
    // This is slower but catches things like "uberx" matching "uber" if we want that behavior.
    // However, strict word matching is usually better to avoid false positives.
    // Let's stick to strict word matching for single words to be safe and fast.
    // If the user types "uberx", they should add "uberx" to the dictionary or we rely on "uber" being a separate word.

    // If we really want substring matching for single words too:
    /*
    for (const [word, category] of WORD_TO_CATEGORY) {
        if (normalized.includes(word)) return category;
    }
    */
    // But iterating a Map is O(N). The above logic is O(Words in Description).
    // Given the user wants "fast", the tokenization approach is superior.

    return null;
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
    return Object.keys(KEYWORD_DICTIONARY);
}

/**
 * Get keywords for a specific category
 */
export function getKeywordsForCategory(category: string): string[] {
    return KEYWORD_DICTIONARY[category] || [];
}
