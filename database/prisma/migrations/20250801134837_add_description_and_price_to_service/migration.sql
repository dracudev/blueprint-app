-- AlterTable
ALTER TABLE `services` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;
