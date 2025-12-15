-- AlterTable
ALTER TABLE "loans" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_payment_date" TIMESTAMP(3),
ADD COLUMN     "source_id" TEXT,
ADD COLUMN     "source_type" TEXT NOT NULL DEFAULT 'direct';

-- AlterTable
ALTER TABLE "settlements" ADD COLUMN     "loan_id" TEXT;

-- CreateTable
CREATE TABLE "loan_adjustments" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "adjustment_type" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "reason" TEXT,
    "notes" TEXT,
    "payment_method" TEXT,
    "payment_date" DATE,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_adjustments_loan_id_created_at_idx" ON "loan_adjustments"("loan_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "loan_adjustments_adjustment_type_idx" ON "loan_adjustments"("adjustment_type");

-- CreateIndex
CREATE INDEX "loan_adjustments_created_by_idx" ON "loan_adjustments"("created_by");

-- CreateIndex
CREATE INDEX "loans_group_id_idx" ON "loans"("group_id");

-- CreateIndex
CREATE INDEX "loans_source_type_idx" ON "loans"("source_type");

-- CreateIndex
CREATE INDEX "loans_lender_user_id_is_deleted_idx" ON "loans"("lender_user_id", "is_deleted");

-- CreateIndex
CREATE INDEX "loans_borrower_user_id_is_deleted_idx" ON "loans"("borrower_user_id", "is_deleted");

-- CreateIndex
CREATE INDEX "settlements_loan_id_idx" ON "settlements"("loan_id");

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_adjustments" ADD CONSTRAINT "loan_adjustments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_adjustments" ADD CONSTRAINT "loan_adjustments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
