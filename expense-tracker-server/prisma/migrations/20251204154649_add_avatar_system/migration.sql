-- CreateEnum
CREATE TYPE "UserAvatarStyle" AS ENUM ('rings', 'shapes', 'initials');

-- CreateEnum
CREATE TYPE "GroupIconProvider" AS ENUM ('jdenticon');

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "icon_provider" "GroupIconProvider" DEFAULT 'jdenticon',
ADD COLUMN     "icon_seed" TEXT,
ADD COLUMN     "icon_url" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_seed" TEXT,
ADD COLUMN     "avatar_style" "UserAvatarStyle" DEFAULT 'rings',
ADD COLUMN     "avatar_url" TEXT;
