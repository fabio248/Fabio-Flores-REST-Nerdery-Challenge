-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "amount_dislike" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "amount_dislike" INTEGER DEFAULT 0;
