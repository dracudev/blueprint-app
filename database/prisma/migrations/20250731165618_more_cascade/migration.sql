-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `projectitems` DROP FOREIGN KEY `ProjectItems_project_id_fkey`;

-- DropIndex
DROP INDEX `Payments_project_id_fkey` ON `payments`;

-- DropIndex
DROP INDEX `ProjectItems_project_id_fkey` ON `projectitems`;

-- AddForeignKey
ALTER TABLE `ProjectItems` ADD CONSTRAINT `ProjectItems_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Projects`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Projects`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
