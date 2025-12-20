/*
  Warnings:

  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "email_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferences" TEXT,
ADD COLUMN     "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
