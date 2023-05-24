/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `type` to the `users_like_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `users_like_posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'MODERATOR');

-- CreateEnum
CREATE TYPE "type_reaction" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "verify_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users_like_comments" ADD COLUMN     "type" "type_reaction" NOT NULL;

-- AlterTable
ALTER TABLE "users_like_posts" ADD COLUMN     "type" "type_reaction" NOT NULL;

-- DropEnum
DROP TYPE "Role";
