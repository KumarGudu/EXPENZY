-- AlterEnum: Update UserAvatarStyle enum values
BEGIN;

-- Create new enum with updated values
CREATE TYPE "UserAvatarStyle_new" AS ENUM ('adventurer', 'adventurer_neutral', 'thumbs', 'fun_emoji');

-- Update existing data to use new enum values (map old to new)
UPDATE "users" SET "avatar_style" = 'adventurer'::text WHERE "avatar_style" = 'rings'::text;
UPDATE "users" SET "avatar_style" = 'adventurer'::text WHERE "avatar_style" = 'shapes'::text;
UPDATE "users" SET "avatar_style" = 'adventurer'::text WHERE "avatar_style" = 'initials'::text;

-- Alter column to use new enum
ALTER TABLE "users" ALTER COLUMN "avatar_style" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "avatar_style" TYPE "UserAvatarStyle_new" USING ("avatar_style"::text::"UserAvatarStyle_new");
ALTER TABLE "users" ALTER COLUMN "avatar_style" SET DEFAULT 'adventurer'::"UserAvatarStyle_new";

-- Drop old enum and rename new one
DROP TYPE "UserAvatarStyle";
ALTER TYPE "UserAvatarStyle_new" RENAME TO "UserAvatarStyle";

COMMIT;
