-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_product_id_fkey";
