-- CreateIndex
CREATE INDEX "attachments_user_id_idx" ON "attachments"("user_id");

-- CreateIndex
CREATE INDEX "attachments_entity_type_entity_id_idx" ON "attachments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "attachments_created_at_idx" ON "attachments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "budgets_user_id_is_active_idx" ON "budgets"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "budgets_category_id_idx" ON "budgets"("category_id");

-- CreateIndex
CREATE INDEX "budgets_user_id_period_type_is_active_idx" ON "budgets"("user_id", "period_type", "is_active");

-- CreateIndex
CREATE INDEX "budgets_start_date_end_date_idx" ON "budgets"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "budgets_user_id_start_date_end_date_idx" ON "budgets"("user_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "categories_parent_category_id_idx" ON "categories"("parent_category_id");

-- CreateIndex
CREATE INDEX "categories_user_id_is_system_idx" ON "categories"("user_id", "is_system");

-- CreateIndex
CREATE INDEX "exchange_rates_base_currency_target_currency_rate_date_idx" ON "exchange_rates"("base_currency", "target_currency", "rate_date" DESC);

-- CreateIndex
CREATE INDEX "exchange_rates_rate_date_idx" ON "exchange_rates"("rate_date" DESC);

-- CreateIndex
CREATE INDEX "expenses_user_id_is_recurring_idx" ON "expenses"("user_id", "is_recurring");

-- CreateIndex
CREATE INDEX "expenses_recurring_pattern_id_idx" ON "expenses"("recurring_pattern_id");

-- CreateIndex
CREATE INDEX "expenses_user_id_currency_idx" ON "expenses"("user_id", "currency");

-- CreateIndex
CREATE INDEX "expenses_payment_method_idx" ON "expenses"("payment_method");

-- CreateIndex
CREATE INDEX "expenses_user_id_created_at_idx" ON "expenses"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "expenses_tags_idx" ON "expenses"("tags");

-- CreateIndex
CREATE INDEX "group_members_group_id_idx" ON "group_members"("group_id");

-- CreateIndex
CREATE INDEX "group_members_user_id_idx" ON "group_members"("user_id");

-- CreateIndex
CREATE INDEX "group_members_invite_status_idx" ON "group_members"("invite_status");

-- CreateIndex
CREATE INDEX "group_members_group_id_role_idx" ON "group_members"("group_id", "role");

-- CreateIndex
CREATE INDEX "group_members_member_email_idx" ON "group_members"("member_email");

-- CreateIndex
CREATE INDEX "groups_created_by_user_id_idx" ON "groups"("created_by_user_id");

-- CreateIndex
CREATE INDEX "groups_is_active_idx" ON "groups"("is_active");

-- CreateIndex
CREATE INDEX "groups_created_at_idx" ON "groups"("created_at" DESC);

-- CreateIndex
CREATE INDEX "loan_payments_loan_id_idx" ON "loan_payments"("loan_id");

-- CreateIndex
CREATE INDEX "loan_payments_payment_date_idx" ON "loan_payments"("payment_date" DESC);

-- CreateIndex
CREATE INDEX "loan_payments_loan_id_payment_date_idx" ON "loan_payments"("loan_id", "payment_date" DESC);

-- CreateIndex
CREATE INDEX "loans_lender_user_id_due_date_idx" ON "loans"("lender_user_id", "due_date");

-- CreateIndex
CREATE INDEX "loans_borrower_user_id_due_date_idx" ON "loans"("borrower_user_id", "due_date");

-- CreateIndex
CREATE INDEX "loans_loan_date_idx" ON "loans"("loan_date");

-- CreateIndex
CREATE INDEX "monthly_summaries_user_id_year_month_idx" ON "monthly_summaries"("user_id", "year", "month");

-- CreateIndex
CREATE INDEX "monthly_summaries_year_month_idx" ON "monthly_summaries"("year", "month");

-- CreateIndex
CREATE INDEX "monthly_summaries_user_id_year_idx" ON "monthly_summaries"("user_id", "year");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_related_entity_type_related_entity_id_idx" ON "notifications"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "recurring_patterns_user_id_is_active_idx" ON "recurring_patterns"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "recurring_patterns_next_occurrence_is_active_idx" ON "recurring_patterns"("next_occurrence", "is_active");

-- CreateIndex
CREATE INDEX "recurring_patterns_frequency_idx" ON "recurring_patterns"("frequency");

-- CreateIndex
CREATE INDEX "recurring_patterns_user_id_frequency_is_active_idx" ON "recurring_patterns"("user_id", "frequency", "is_active");

-- CreateIndex
CREATE INDEX "split_expenses_group_id_idx" ON "split_expenses"("group_id");

-- CreateIndex
CREATE INDEX "split_expenses_paid_by_user_id_is_settled_idx" ON "split_expenses"("paid_by_user_id", "is_settled");

-- CreateIndex
CREATE INDEX "split_expenses_group_id_is_settled_idx" ON "split_expenses"("group_id", "is_settled");

-- CreateIndex
CREATE INDEX "split_expenses_created_at_idx" ON "split_expenses"("created_at" DESC);

-- CreateIndex
CREATE INDEX "split_participants_user_id_is_settled_idx" ON "split_participants"("user_id", "is_settled");

-- CreateIndex
CREATE INDEX "split_participants_split_expense_id_idx" ON "split_participants"("split_expense_id");

-- CreateIndex
CREATE INDEX "split_participants_user_id_idx" ON "split_participants"("user_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_is_active_is_deleted_idx" ON "users"("is_active", "is_deleted");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_last_login_at_idx" ON "users"("last_login_at");

-- CreateIndex
CREATE INDEX "yearly_summaries_user_id_year_idx" ON "yearly_summaries"("user_id", "year");

-- CreateIndex
CREATE INDEX "yearly_summaries_year_idx" ON "yearly_summaries"("year");
