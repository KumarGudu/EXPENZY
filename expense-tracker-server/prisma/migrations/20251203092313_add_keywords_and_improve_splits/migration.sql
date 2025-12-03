/*
  Warnings:

  - The `currency` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `default_currency` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "auto_detected_category" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_confidence" DOUBLE PRECISION,
ADD COLUMN     "category_source" TEXT,
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "default_currency",
ADD COLUMN     "default_currency" "Currency" NOT NULL DEFAULT 'INR';

-- CreateTable
CREATE TABLE "category_cache" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_keywords" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_expenses" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "paid_by_user_id" TEXT,
    "paid_by_name" TEXT,
    "category_id" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT NOT NULL,
    "expense_date" DATE NOT NULL,
    "notes" TEXT,
    "receipt_url" TEXT,
    "split_type" TEXT NOT NULL DEFAULT 'equal',
    "is_settled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_expense_splits" (
    "id" TEXT NOT NULL,
    "group_expense_id" TEXT NOT NULL,
    "user_id" TEXT,
    "member_name" TEXT,
    "amount_owed" DECIMAL(15,2) NOT NULL,
    "amount_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "percentage" DECIMAL(5,2),
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_expense_splits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "settled_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_cache_description_key" ON "category_cache"("description");

-- CreateIndex
CREATE INDEX "category_cache_description_idx" ON "category_cache"("description");

-- CreateIndex
CREATE INDEX "category_cache_category_idx" ON "category_cache"("category");

-- CreateIndex
CREATE INDEX "category_cache_source_idx" ON "category_cache"("source");

-- CreateIndex
CREATE INDEX "category_keywords_category_idx" ON "category_keywords"("category");

-- CreateIndex
CREATE INDEX "category_keywords_keyword_idx" ON "category_keywords"("keyword");

-- CreateIndex
CREATE INDEX "category_keywords_user_id_idx" ON "category_keywords"("user_id");

-- CreateIndex
CREATE INDEX "category_keywords_isSystem_priority_idx" ON "category_keywords"("isSystem", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "category_keywords_category_keyword_user_id_key" ON "category_keywords"("category", "keyword", "user_id");

-- CreateIndex
CREATE INDEX "group_expenses_group_id_idx" ON "group_expenses"("group_id");

-- CreateIndex
CREATE INDEX "group_expenses_paid_by_user_id_idx" ON "group_expenses"("paid_by_user_id");

-- CreateIndex
CREATE INDEX "group_expenses_expense_date_idx" ON "group_expenses"("expense_date");

-- CreateIndex
CREATE INDEX "group_expenses_is_settled_idx" ON "group_expenses"("is_settled");

-- CreateIndex
CREATE INDEX "group_expenses_category_id_idx" ON "group_expenses"("category_id");

-- CreateIndex
CREATE INDEX "group_expense_splits_group_expense_id_idx" ON "group_expense_splits"("group_expense_id");

-- CreateIndex
CREATE INDEX "group_expense_splits_user_id_idx" ON "group_expense_splits"("user_id");

-- CreateIndex
CREATE INDEX "group_expense_splits_is_paid_idx" ON "group_expense_splits"("is_paid");

-- CreateIndex
CREATE UNIQUE INDEX "group_expense_splits_group_expense_id_user_id_key" ON "group_expense_splits"("group_expense_id", "user_id");

-- CreateIndex
CREATE INDEX "settlements_group_id_idx" ON "settlements"("group_id");

-- CreateIndex
CREATE INDEX "settlements_from_user_id_idx" ON "settlements"("from_user_id");

-- CreateIndex
CREATE INDEX "settlements_to_user_id_idx" ON "settlements"("to_user_id");

-- CreateIndex
CREATE INDEX "settlements_settled_at_idx" ON "settlements"("settled_at");

-- CreateIndex
CREATE INDEX "expenses_user_id_currency_idx" ON "expenses"("user_id", "currency");

-- AddForeignKey
ALTER TABLE "category_keywords" ADD CONSTRAINT "category_keywords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_paid_by_user_id_fkey" FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_group_expense_id_fkey" FOREIGN KEY ("group_expense_id") REFERENCES "group_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
