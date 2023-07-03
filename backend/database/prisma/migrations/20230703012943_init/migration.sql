/*
  Warnings:

  - You are about to drop the column `image` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `image`,
    ADD COLUMN `imagePath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatar`,
    ADD COLUMN `avatar_path` VARCHAR(191) NULL;
