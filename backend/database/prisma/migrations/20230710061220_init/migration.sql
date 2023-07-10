/*
  Warnings:

  - You are about to drop the column `body` on the `comment` table. All the data in the column will be lost.
  - Added the required column `description` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `body`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
