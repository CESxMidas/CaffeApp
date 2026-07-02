-- Add isPrepared and preparedAt columns to order_items table
ALTER TABLE "order_items" ADD COLUMN "is_prepared" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "order_items" ADD COLUMN "prepared_at" TIMESTAMP(3);