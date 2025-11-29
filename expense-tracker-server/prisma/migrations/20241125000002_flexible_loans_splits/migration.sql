-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_borrower_user_id_fkey";

-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_lender_user_id_fkey";

-- DropForeignKey
ALTER TABLE "split_expenses" DROP CONSTRAINT "split_expenses_paid_by_user_id_fkey";

-- DropIndex
DROP INDEX "split_participants_split_expense_id_user_id_key";

-- AlterTable
ALTER TABLE "loans" ADD COLUMN     "borrower_email" TEXT,
ADD COLUMN     "borrower_name" TEXT,
ADD COLUMN     "borrower_phone" TEXT,
ADD COLUMN     "created_by_user_id" TEXT NOT NULL,
ADD COLUMN     "invite_status" TEXT DEFAULT 'pending',
ADD COLUMN     "invite_token" TEXT,
ADD COLUMN     "invited_at" TIMESTAMP(3),
ADD COLUMN     "lender_email" TEXT,
ADD COLUMN     "lender_name" TEXT,
ADD COLUMN     "lender_phone" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "lender_user_id" DROP NOT NULL,
ALTER COLUMN "borrower_user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "split_expenses" ADD COLUMN     "created_by_user_id" TEXT NOT NULL,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "paid_by_email" TEXT,
ADD COLUMN     "paid_by_name" TEXT,
ALTER COLUMN "expense_id" DROP NOT NULL,
ALTER COLUMN "paid_by_user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "split_participants" ADD COLUMN     "invite_status" TEXT DEFAULT 'pending',
ADD COLUMN     "invite_token" TEXT,
ADD COLUMN     "invited_at" TIMESTAMP(3),
ADD COLUMN     "participant_email" TEXT,
ADD COLUMN     "participant_name" TEXT,
ADD COLUMN     "participant_phone" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "full_name",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "last_name" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT,
    "member_name" TEXT,
    "member_email" TEXT,
    "member_phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "invite_token" TEXT,
    "invite_status" TEXT NOT NULL DEFAULT 'pending',
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_members_invite_token_key" ON "group_members"("invite_token");

-- CreateIndex
CREATE UNIQUE INDEX "loans_invite_token_key" ON "loans"("invite_token");

-- CreateIndex
CREATE UNIQUE INDEX "split_participants_invite_token_key" ON "split_participants"("invite_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "split_expenses" ADD CONSTRAINT "split_expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "split_expenses" ADD CONSTRAINT "split_expenses_paid_by_user_id_fkey" FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "split_expenses" ADD CONSTRAINT "split_expenses_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_lender_user_id_fkey" FOREIGN KEY ("lender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_user_id_fkey" FOREIGN KEY ("borrower_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

