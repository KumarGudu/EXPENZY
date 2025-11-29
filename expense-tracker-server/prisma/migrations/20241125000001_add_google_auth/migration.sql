-- AlterTable
ALTER TABLE "users" DROP COLUMN "full_name",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "last_name" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

