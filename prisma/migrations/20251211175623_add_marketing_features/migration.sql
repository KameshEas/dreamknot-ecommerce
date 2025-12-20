-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discount_amount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "discount_code_id" INTEGER;

-- CreateTable
CREATE TABLE "discount_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" TEXT NOT NULL,
    "discount_value" DOUBLE PRECISION NOT NULL,
    "minimum_order" DOUBLE PRECISION DEFAULT 0,
    "maximum_discount" DOUBLE PRECISION,
    "usage_limit" INTEGER,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "applicable_products" TEXT,
    "applicable_categories" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotional_campaigns" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "banner_image" TEXT,
    "banner_text" TEXT,
    "discount_code_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "target_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotional_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_subscribers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "preferences" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),

    CONSTRAINT "email_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reward_type" TEXT NOT NULL,
    "reward_value" DOUBLE PRECISION NOT NULL,
    "usage_limit" INTEGER DEFAULT 10,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" SERIAL NOT NULL,
    "referral_code_id" INTEGER NOT NULL,
    "referred_user_id" INTEGER,
    "referred_email" TEXT NOT NULL,
    "reward_earned" BOOLEAN NOT NULL DEFAULT false,
    "reward_amount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discount_codes_code_key" ON "discount_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "email_subscribers_email_key" ON "email_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "referral_codes_code_key" ON "referral_codes"("code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotional_campaigns" ADD CONSTRAINT "promotional_campaigns_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "referral_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
