-- CreateIndex
CREATE INDEX "group_members_group_id_invite_status_idx" ON "group_members"("group_id", "invite_status");

-- CreateIndex
CREATE INDEX "group_members_invite_token_idx" ON "group_members"("invite_token");

-- CreateIndex
CREATE INDEX "groups_created_by_user_id_is_active_idx" ON "groups"("created_by_user_id", "is_active");
