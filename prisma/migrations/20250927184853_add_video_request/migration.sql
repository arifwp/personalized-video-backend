/*
  Warnings:

  - You are about to drop the column `voiceId` on the `VideoRequest` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `VideoRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VideoRequest" DROP COLUMN "voiceId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
