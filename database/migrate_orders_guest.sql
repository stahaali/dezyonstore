-- If you already imported an older schema, either:
--   A) Drop DB and re-import database/dezyon_store_schema.sql  (recommended), OR
--   B) Run the statements below carefully (skip columns that already exist).

USE `dezyon_store`;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop old product FK if present (static catalog ids are not in MySQL products table)
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_product_fk`;

ALTER TABLE `orders`
  MODIFY `user_id` VARCHAR(36) DEFAULT NULL;

ALTER TABLE `orders` ADD COLUMN `customer_name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `user_id`;
ALTER TABLE `orders` ADD COLUMN `customer_email` VARCHAR(255) NOT NULL DEFAULT '' AFTER `customer_name`;
ALTER TABLE `orders` ADD COLUMN `customer_phone` VARCHAR(50) NOT NULL DEFAULT '' AFTER `customer_email`;
ALTER TABLE `orders` ADD COLUMN `shipping_line1` VARCHAR(255) NOT NULL DEFAULT '' AFTER `customer_phone`;
ALTER TABLE `orders` ADD COLUMN `shipping_line2` VARCHAR(255) DEFAULT NULL AFTER `shipping_line1`;
ALTER TABLE `orders` ADD COLUMN `shipping_city` VARCHAR(100) NOT NULL DEFAULT '' AFTER `shipping_line2`;
ALTER TABLE `orders` ADD COLUMN `shipping_state` VARCHAR(100) NOT NULL DEFAULT '' AFTER `shipping_city`;
ALTER TABLE `orders` ADD COLUMN `shipping_postal_code` VARCHAR(30) NOT NULL DEFAULT '' AFTER `shipping_state`;
ALTER TABLE `orders` ADD COLUMN `shipping_country` VARCHAR(100) NOT NULL DEFAULT 'Canada' AFTER `shipping_postal_code`;
ALTER TABLE `orders` ADD COLUMN `notes` TEXT DEFAULT NULL AFTER `currency`;

ALTER TABLE `order_items` ADD COLUMN `product_name` VARCHAR(500) NOT NULL DEFAULT '' AFTER `product_id`;
ALTER TABLE `order_items` ADD COLUMN `product_image` VARCHAR(1000) DEFAULT NULL AFTER `product_name`;
ALTER TABLE `order_items` MODIFY `product_id` VARCHAR(64) DEFAULT NULL;

SET FOREIGN_KEY_CHECKS = 1;
