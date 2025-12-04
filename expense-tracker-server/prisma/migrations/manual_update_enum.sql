-- Step 1: Rename old enum
ALTER TYPE "UserAvatarStyle" RENAME TO "UserAvatarStyle_old";

-- Step 2: Create new enum with new values
CREATE TYPE "UserAvatarStyle" AS ENUM ('adventurer', 'adventurer_neutral', 'thumbs', 'fun_emoji');

-- Step 3: Add temporary column with new enum type
ALTER TABLE users ADD COLUMN avatar_style_new "UserAvatarStyle";

-- Step 4: Set all values to 'adventurer' (default)
UPDATE users SET avatar_style_new = 'adventurer';

-- Step 5: Drop old column
ALTER TABLE users DROP COLUMN avatar_style;

-- Step 6: Rename new column to original name
ALTER TABLE users RENAME COLUMN avatar_style_new TO avatar_style;

-- Step 7: Set default value
ALTER TABLE users ALTER COLUMN avatar_style SET DEFAULT 'adventurer'::"UserAvatarStyle";

-- Step 8: Drop old enum
DROP TYPE "UserAvatarStyle_old";
