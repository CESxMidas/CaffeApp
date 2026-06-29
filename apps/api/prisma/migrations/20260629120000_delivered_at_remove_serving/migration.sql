-- GAP-05: delivered_at thay SERVING; migrate data rồi gỡ enum value

ALTER TABLE "orders" ADD COLUMN "delivered_at" TIMESTAMP(3);

UPDATE "orders"
SET
  "status" = 'READY',
  "delivered_at" = COALESCE("delivered_at", NOW())
WHERE "status" = 'SERVING';

CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'MAKING', 'READY', 'PAID', 'CANCELLED');

ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders"
  ALTER COLUMN "status" TYPE "OrderStatus_new"
  USING ("status"::text::"OrderStatus_new");

ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";

ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"OrderStatus";
