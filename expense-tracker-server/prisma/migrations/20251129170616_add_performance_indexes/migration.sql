-- CreateIndex
CREATE INDEX "account_transactions_account_id_type_date_idx" ON "account_transactions"("account_id", "type", "date" DESC);

-- CreateIndex
CREATE INDEX "accounts_user_id_type_idx" ON "accounts"("user_id", "type");

-- CreateIndex
CREATE INDEX "accounts_type_idx" ON "accounts"("type");

-- CreateIndex
CREATE INDEX "incomes_user_id_category_id_idx" ON "incomes"("user_id", "category_id");

-- CreateIndex
CREATE INDEX "incomes_income_date_idx" ON "incomes"("income_date");

-- CreateIndex
CREATE INDEX "payment_methods_user_id_type_idx" ON "payment_methods"("user_id", "type");

-- CreateIndex
CREATE INDEX "savings_goals_user_id_created_at_idx" ON "savings_goals"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "savings_goals_is_completed_is_archived_idx" ON "savings_goals"("is_completed", "is_archived");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_billing_cycle_idx" ON "subscriptions"("user_id", "billing_cycle");

-- CreateIndex
CREATE INDEX "subscriptions_category_id_idx" ON "subscriptions"("category_id");

-- CreateIndex
CREATE INDEX "tags_user_id_created_at_idx" ON "tags"("user_id", "created_at" DESC);
