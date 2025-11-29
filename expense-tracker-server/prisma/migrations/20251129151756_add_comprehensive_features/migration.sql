/*
  Warnings:

  - You are about to drop the column `tags` on the `expenses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "expenses_tags_idx";

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "allow_rollover" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rolled_over_amount" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "action_label" TEXT,
ADD COLUMN     "action_url" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'normal';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_password_change" TIMESTAMP(3),
ADD COLUMN     "monthly_expense_target" DECIMAL(15,2),
ADD COLUMN     "monthly_income_target" DECIMAL(15,2),
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "incomes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "source" TEXT NOT NULL,
    "description" TEXT,
    "income_date" DATE NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_pattern_id" TEXT,
    "payment_method" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "income_categories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "income_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_goals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "target_amount" DECIMAL(15,2) NOT NULL,
    "current_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "target_date" DATE,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "icon" TEXT,
    "color" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_contributions" (
    "id" TEXT NOT NULL,
    "savings_goal_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contribution_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billing_cycle" TEXT NOT NULL,
    "category_id" TEXT,
    "start_date" DATE NOT NULL,
    "next_billing_date" DATE NOT NULL,
    "end_date" DATE,
    "payment_method" TEXT,
    "website" TEXT,
    "reminder_days" INTEGER NOT NULL DEFAULT 3,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "color" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_tags" (
    "expense_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_tags_pkey" PRIMARY KEY ("expense_id","tag_id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last_four_digits" TEXT,
    "bank_name" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "bank_name" TEXT,
    "account_number" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "include_in_total" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_transactions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "related_type" TEXT,
    "related_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'en',
    "date_format" TEXT NOT NULL DEFAULT 'YYYY-MM-DD',
    "time_format" TEXT NOT NULL DEFAULT '24h',
    "week_start_day" TEXT NOT NULL DEFAULT 'monday',
    "default_view" TEXT NOT NULL DEFAULT 'dashboard',
    "notification_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "budget_alerts" BOOLEAN NOT NULL DEFAULT true,
    "subscription_reminders" BOOLEAN NOT NULL DEFAULT true,
    "loan_reminders" BOOLEAN NOT NULL DEFAULT true,
    "export_format" TEXT NOT NULL DEFAULT 'pdf',
    "biometric_enabled" BOOLEAN NOT NULL DEFAULT false,
    "auto_backup" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incomes_user_id_income_date_idx" ON "incomes"("user_id", "income_date" DESC);

-- CreateIndex
CREATE INDEX "incomes_category_id_idx" ON "incomes"("category_id");

-- CreateIndex
CREATE INDEX "incomes_user_id_deleted_at_idx" ON "incomes"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "incomes_user_id_source_idx" ON "incomes"("user_id", "source");

-- CreateIndex
CREATE INDEX "incomes_user_id_is_recurring_idx" ON "incomes"("user_id", "is_recurring");

-- CreateIndex
CREATE INDEX "incomes_recurring_pattern_id_idx" ON "incomes"("recurring_pattern_id");

-- CreateIndex
CREATE INDEX "income_categories_user_id_is_system_idx" ON "income_categories"("user_id", "is_system");

-- CreateIndex
CREATE UNIQUE INDEX "income_categories_user_id_name_key" ON "income_categories"("user_id", "name");

-- CreateIndex
CREATE INDEX "savings_goals_user_id_is_completed_is_archived_idx" ON "savings_goals"("user_id", "is_completed", "is_archived");

-- CreateIndex
CREATE INDEX "savings_goals_user_id_target_date_idx" ON "savings_goals"("user_id", "target_date");

-- CreateIndex
CREATE INDEX "savings_goals_user_id_priority_idx" ON "savings_goals"("user_id", "priority");

-- CreateIndex
CREATE INDEX "savings_contributions_savings_goal_id_contribution_date_idx" ON "savings_contributions"("savings_goal_id", "contribution_date" DESC);

-- CreateIndex
CREATE INDEX "subscriptions_user_id_is_active_idx" ON "subscriptions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_next_billing_date_idx" ON "subscriptions"("user_id", "next_billing_date");

-- CreateIndex
CREATE INDEX "subscriptions_next_billing_date_is_active_idx" ON "subscriptions"("next_billing_date", "is_active");

-- CreateIndex
CREATE INDEX "subscriptions_billing_cycle_idx" ON "subscriptions"("billing_cycle");

-- CreateIndex
CREATE INDEX "tags_user_id_idx" ON "tags"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_user_id_name_key" ON "tags"("user_id", "name");

-- CreateIndex
CREATE INDEX "expense_tags_tag_id_idx" ON "expense_tags"("tag_id");

-- CreateIndex
CREATE INDEX "expense_tags_expense_id_idx" ON "expense_tags"("expense_id");

-- CreateIndex
CREATE INDEX "payment_methods_user_id_is_active_idx" ON "payment_methods"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "payment_methods_user_id_is_default_idx" ON "payment_methods"("user_id", "is_default");

-- CreateIndex
CREATE INDEX "accounts_user_id_is_active_idx" ON "accounts"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "accounts_user_id_include_in_total_idx" ON "accounts"("user_id", "include_in_total");

-- CreateIndex
CREATE INDEX "account_transactions_account_id_date_idx" ON "account_transactions"("account_id", "date" DESC);

-- CreateIndex
CREATE INDEX "account_transactions_related_type_related_id_idx" ON "account_transactions"("related_type", "related_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_priority_is_read_idx" ON "notifications"("user_id", "priority", "is_read");

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "income_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_recurring_pattern_id_fkey" FOREIGN KEY ("recurring_pattern_id") REFERENCES "recurring_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_categories" ADD CONSTRAINT "income_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_contributions" ADD CONSTRAINT "savings_contributions_savings_goal_id_fkey" FOREIGN KEY ("savings_goal_id") REFERENCES "savings_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_tags" ADD CONSTRAINT "expense_tags_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_tags" ADD CONSTRAINT "expense_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
