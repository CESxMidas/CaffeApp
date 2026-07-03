-- CreateTable
CREATE TABLE "password_change_otps" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "new_password_hash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_change_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "password_change_otps_user_id_consumed_at_expires_at_idx" ON "password_change_otps"("user_id", "consumed_at", "expires_at");

-- AddForeignKey
ALTER TABLE "password_change_otps" ADD CONSTRAINT "password_change_otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
