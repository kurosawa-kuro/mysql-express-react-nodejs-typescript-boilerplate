/*
  Warnings:

  - You are about to drop the column `imagePath` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_path` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `tagsonposts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tagsonposts` DROP FOREIGN KEY `TagsOnPosts_postId_fkey`;

-- DropForeignKey
ALTER TABLE `tagsonposts` DROP FOREIGN KEY `TagsOnPosts_tagId_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `imagePath`,
    ADD COLUMN `imagePath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatar_path`,
    ADD COLUMN `avatarPath` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `tagsonposts`;

-- CreateTable
CREATE TABLE `Information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `radio` VARCHAR(191) NULL,
    `checkbox` BOOLEAN NULL,
    `list` VARCHAR(191) NULL,
    `imagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags_on_posts` (
    `postId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`postId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tags_on_posts` ADD CONSTRAINT `tags_on_posts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags_on_posts` ADD CONSTRAINT `tags_on_posts_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
