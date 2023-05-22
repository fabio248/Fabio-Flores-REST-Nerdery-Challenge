/*
  Warnings:

  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_comments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_comments" DROP CONSTRAINT "users_comments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "users_comments" DROP CONSTRAINT "users_comments_userId_fkey";

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "amount_like" INTEGER DEFAULT 0,
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "amount_like" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "is_public_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_public_name" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "profile";

-- DropTable
DROP TABLE "users_comments";

-- CreateTable
CREATE TABLE "users_like_comments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "commentId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_like_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_like_posts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "postId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_like_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_like_comments" ADD CONSTRAINT "users_like_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_like_comments" ADD CONSTRAINT "users_like_comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_like_posts" ADD CONSTRAINT "users_like_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_like_posts" ADD CONSTRAINT "users_like_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
