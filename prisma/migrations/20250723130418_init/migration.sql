-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clerkId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_clerkId_key`(`clerkId`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Word` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `definition` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NULL,
    `latin` VARCHAR(191) NULL,

    UNIQUE INDEX `Word_text_key`(`text`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WordRelation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromWordId` INTEGER NOT NULL,
    `toWordId` INTEGER NOT NULL,
    `relationType` ENUM('SYNONYM', 'ANTONYM') NOT NULL,

    UNIQUE INDEX `WordRelation_fromWordId_toWordId_relationType_key`(`fromWordId`, `toWordId`, `relationType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WordRelation` ADD CONSTRAINT `WordRelation_fromWordId_fkey` FOREIGN KEY (`fromWordId`) REFERENCES `Word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WordRelation` ADD CONSTRAINT `WordRelation_toWordId_fkey` FOREIGN KEY (`toWordId`) REFERENCES `Word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
