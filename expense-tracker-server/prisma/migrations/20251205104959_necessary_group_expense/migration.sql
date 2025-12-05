-- AlterTable
ALTER TABLE "group_expenses" ADD COLUMN     "exchange_rate" DECIMAL(10,6),
ADD COLUMN     "last_modified_at" TIMESTAMP(3),
ADD COLUMN     "last_modified_by" TEXT,
ADD COLUMN     "original_currency" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "settlements" ADD COLUMN     "dispute_reason" TEXT,
ADD COLUMN     "disputed_at" TIMESTAMP(3),
ADD COLUMN     "disputed_by" TEXT,
ADD COLUMN     "resolution_notes" TEXT,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolved_by" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed';

-- CreateTable
CREATE TABLE "group_expense_history" (
    "id" TEXT NOT NULL,
    "group_expense_id" TEXT NOT NULL,
    "modified_by" TEXT NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_type" TEXT NOT NULL,
    "previous_data" JSONB,
    "new_data" JSONB,
    "change_reason" TEXT,

    CONSTRAINT "group_expense_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_exchange_rates" (
    "id" TEXT NOT NULL,
    "from_currency" TEXT NOT NULL,
    "to_currency" TEXT NOT NULL,
    "rate" DECIMAL(10,6) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currency_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_group_expenses" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "split_type" TEXT NOT NULL,
    "category_id" TEXT,
    "frequency" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "day_of_week" INTEGER,
    "day_of_month" INTEGER,
    "month_of_year" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "next_occurrence" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_group_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_group_expense_participants" (
    "id" TEXT NOT NULL,
    "recurring_group_expense_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2),
    "percentage" DECIMAL(5,2),
    "shares" DECIMAL(10,2),

    CONSTRAINT "recurring_group_expense_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "group_expense_history_group_expense_id_idx" ON "group_expense_history"("group_expense_id");

-- CreateIndex
CREATE INDEX "group_expense_history_modified_by_idx" ON "group_expense_history"("modified_by");

-- CreateIndex
CREATE INDEX "group_expense_history_modified_at_idx" ON "group_expense_history"("modified_at");

-- CreateIndex
CREATE INDEX "currency_exchange_rates_from_currency_to_currency_idx" ON "currency_exchange_rates"("from_currency", "to_currency");

-- CreateIndex
CREATE INDEX "currency_exchange_rates_effective_date_idx" ON "currency_exchange_rates"("effective_date");

-- CreateIndex
CREATE UNIQUE INDEX "currency_exchange_rates_from_currency_to_currency_effective_key" ON "currency_exchange_rates"("from_currency", "to_currency", "effective_date");

-- CreateIndex
CREATE INDEX "recurring_group_expenses_group_id_idx" ON "recurring_group_expenses"("group_id");

-- CreateIndex
CREATE INDEX "recurring_group_expenses_is_active_idx" ON "recurring_group_expenses"("is_active");

-- CreateIndex
CREATE INDEX "recurring_group_expenses_next_occurrence_idx" ON "recurring_group_expenses"("next_occurrence");

-- CreateIndex
CREATE UNIQUE INDEX "recurring_group_expense_participants_recurring_group_expens_key" ON "recurring_group_expense_participants"("recurring_group_expense_id", "user_id");

-- CreateIndex
CREATE INDEX "settlements_status_idx" ON "settlements"("status");

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_disputed_by_fkey" FOREIGN KEY ("disputed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_history" ADD CONSTRAINT "group_expense_history_group_expense_id_fkey" FOREIGN KEY ("group_expense_id") REFERENCES "group_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_history" ADD CONSTRAINT "group_expense_history_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_group_expenses" ADD CONSTRAINT "recurring_group_expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_group_expenses" ADD CONSTRAINT "recurring_group_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_group_expenses" ADD CONSTRAINT "recurring_group_expenses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_group_expense_participants" ADD CONSTRAINT "recurring_group_expense_participants_recurring_group_expen_fkey" FOREIGN KEY ("recurring_group_expense_id") REFERENCES "recurring_group_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_group_expense_participants" ADD CONSTRAINT "recurring_group_expense_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
