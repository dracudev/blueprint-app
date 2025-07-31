-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `Projects_client_id_fkey`;

-- DropIndex
DROP INDEX `Projects_client_id_fkey` ON `projects`;

-- AddForeignKey
ALTER TABLE `Projects` ADD CONSTRAINT `Projects_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;
