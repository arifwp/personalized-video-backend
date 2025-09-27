/*
  Warnings:

  - You are about to drop the column `whatsapp` on the `VideoRequest` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `VideoRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `videoUrl` on table `VideoRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."VideoRequest" DROP COLUMN "whatsapp",
ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "outputUrl" TEXT,
ALTER COLUMN "videoUrl" SET NOT NULL;
