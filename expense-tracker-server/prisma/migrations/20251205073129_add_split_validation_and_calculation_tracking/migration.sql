/*
  Warnings:

  - The values [rings,shapes,initials] on the enum `UserAvatarStyle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserAvatarStyle_new" AS ENUM ('adventurer', 'adventurer_neutral', 'thumbs', 'fun_emoji');
ALTER TABLE "users" ALTER COLUMN "avatar_style" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "avatar_style" TYPE "UserAvatarStyle_new" USING ("avatar_style"::text::"UserAvatarStyle_new");
ALTER TYPE "UserAvatarStyle" RENAME TO "UserAvatarStyle_old";
ALTER TYPE "UserAvatarStyle_new" RENAME TO "UserAvatarStyle";
DROP TYPE "UserAvatarStyle_old";
ALTER TABLE "users" ALTER COLUMN "avatar_style" SET DEFAULT 'adventurer';
COMMIT;

-- AlterTable
ALTER TABLE "group_expense_splits" ADD COLUMN     "adjustment_amount" DECIMAL(15,2) DEFAULT 0,
ADD COLUMN     "calculated_amount" DECIMAL(15,2),
ADD COLUMN     "calculated_percentage" DECIMAL(5,2),
ADD COLUMN     "exchange_rate" DECIMAL(10,4),
ADD COLUMN     "is_rounding_adjustment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_currency" TEXT;

-- AlterTable
ALTER TABLE "group_expenses" ADD COLUMN     "adjustment_reason" TEXT,
ADD COLUMN     "has_adjustments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "split_validation_status" TEXT DEFAULT 'valid';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_style" SET DEFAULT 'adventurer';

-- CreateTable
CREATE TABLE "split_calculations" (
    "id" TEXT NOT NULL,
    "group_expense_id" TEXT NOT NULL,
    "split_type" TEXT NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "participants_count" INTEGER NOT NULL,
    "rounding_difference" DECIMAL(15,4) NOT NULL DEFAULT 0,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "split_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "split_calculations_group_expense_id_idx" ON "split_calculations"("group_expense_id");

-- CreateIndex
CREATE INDEX "group_expenses_split_validation_status_idx" ON "group_expenses"("split_validation_status");

-- AddForeignKey
ALTER TABLE "split_calculations" ADD CONSTRAINT "split_calculations_group_expense_id_fkey" FOREIGN KEY ("group_expense_id") REFERENCES "group_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
