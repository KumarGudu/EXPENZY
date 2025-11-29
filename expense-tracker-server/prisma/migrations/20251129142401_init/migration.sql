-- CreateIndex
CREATE INDEX "categories_user_id_type_idx" ON "categories"("user_id", "type");

-- CreateIndex
CREATE INDEX "categories_is_system_idx" ON "categories"("is_system");

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "categories"("type");

-- CreateIndex
CREATE INDEX "expenses_user_id_expense_date_idx" ON "expenses"("user_id", "expense_date" DESC);

-- CreateIndex
CREATE INDEX "expenses_category_id_idx" ON "expenses"("category_id");

-- CreateIndex
CREATE INDEX "expenses_user_id_deleted_at_idx" ON "expenses"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "expenses_expense_date_idx" ON "expenses"("expense_date");

-- CreateIndex
CREATE INDEX "expenses_user_id_category_id_expense_date_idx" ON "expenses"("user_id", "category_id", "expense_date");

-- CreateIndex
CREATE INDEX "loans_lender_user_id_status_idx" ON "loans"("lender_user_id", "status");

-- CreateIndex
CREATE INDEX "loans_borrower_user_id_status_idx" ON "loans"("borrower_user_id", "status");

-- CreateIndex
CREATE INDEX "loans_due_date_idx" ON "loans"("due_date");

-- CreateIndex
CREATE INDEX "loans_status_idx" ON "loans"("status");

-- CreateIndex
CREATE INDEX "split_expenses_paid_by_user_id_idx" ON "split_expenses"("paid_by_user_id");

-- CreateIndex
CREATE INDEX "split_expenses_is_settled_idx" ON "split_expenses"("is_settled");

-- CreateIndex
CREATE INDEX "split_expenses_expense_id_idx" ON "split_expenses"("expense_id");
