-- dezyon.store — MySQL / MariaDB schema for phpMyAdmin
-- Import: phpMyAdmin → Import → Choose this file → Go
-- Or: mysql -u root -p < dezyon_store_schema.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `dezyon_store`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `dezyon_store`;

-- ----------------------------
-- Users & auth
-- ----------------------------
DROP TABLE IF EXISTS `wishlist_items`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_specs`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `brands`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `contact_messages`;

CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified` DATETIME DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `role` ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `accounts` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `provider` VARCHAR(100) NOT NULL,
  `provider_account_id` VARCHAR(255) NOT NULL,
  `refresh_token` TEXT DEFAULT NULL,
  `access_token` TEXT DEFAULT NULL,
  `expires_at` INT DEFAULT NULL,
  `token_type` VARCHAR(100) DEFAULT NULL,
  `scope` VARCHAR(255) DEFAULT NULL,
  `id_token` TEXT DEFAULT NULL,
  `session_state` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_unique` (`provider`, `provider_account_id`),
  KEY `accounts_user_id_idx` (`user_id`),
  CONSTRAINT `accounts_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(36) NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `expires` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_token_unique` (`session_token`),
  KEY `sessions_user_id_idx` (`user_id`),
  CONSTRAINT `sessions_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Catalog
-- ----------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `parent_id` VARCHAR(36) DEFAULT NULL,
  `product_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_idx` (`parent_id`),
  CONSTRAINT `categories_parent_fk`
    FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `short_description` VARCHAR(1000) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `compare_at_price` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `in_stock` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0,
  `is_new` TINYINT(1) NOT NULL DEFAULT 0,
  `is_gaming` TINYINT(1) NOT NULL DEFAULT 0,
  `badge` VARCHAR(50) DEFAULT NULL,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `review_count` INT NOT NULL DEFAULT 0,
  `category_id` VARCHAR(36) NOT NULL,
  `brand_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_idx` (`category_id`),
  KEY `products_brand_id_idx` (`brand_id`),
  KEY `products_in_stock_idx` (`in_stock`),
  CONSTRAINT `products_category_fk`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_brand_fk`
    FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_images` (
  `id` VARCHAR(36) NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `alt` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `product_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_idx` (`product_id`),
  CONSTRAINT `product_images_product_fk`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_specs` (
  `id` VARCHAR(36) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `value` VARCHAR(500) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_specs_product_id_idx` (`product_id`),
  CONSTRAINT `product_specs_product_fk`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` VARCHAR(36) NOT NULL,
  `rating` TINYINT NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `comment` TEXT NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_product_id_idx` (`product_id`),
  KEY `reviews_user_id_idx` (`user_id`),
  CONSTRAINT `reviews_product_fk`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Cart (server-side / optional sync)
-- ----------------------------
CREATE TABLE `carts` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `session_id` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  KEY `carts_session_id_idx` (`session_id`),
  CONSTRAINT `carts_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` VARCHAR(36) NOT NULL,
  `cart_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_product_unique` (`cart_id`, `product_id`),
  KEY `cart_items_product_id_idx` (`product_id`),
  CONSTRAINT `cart_items_cart_fk`
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_fk`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Orders & checkout
-- ----------------------------
CREATE TABLE `addresses` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `label` VARCHAR(100) DEFAULT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `line1` VARCHAR(255) NOT NULL,
  `line2` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(30) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_idx` (`user_id`),
  CONSTRAINT `addresses_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `shipping_line1` VARCHAR(255) NOT NULL,
  `shipping_line2` VARCHAR(255) DEFAULT NULL,
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_state` VARCHAR(100) NOT NULL,
  `shipping_postal_code` VARCHAR(30) NOT NULL,
  `shipping_country` VARCHAR(100) NOT NULL DEFAULT 'Canada',
  `status` ENUM('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shipping` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'CAD',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_idx` (`user_id`),
  KEY `orders_status_idx` (`status`),
  KEY `orders_customer_email_idx` (`customer_email`),
  CONSTRAINT `orders_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` VARCHAR(36) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  -- Catalog / frontend product id (no FK — storefront uses static product data)
  `product_id` VARCHAR(64) DEFAULT NULL,
  `product_name` VARCHAR(500) NOT NULL,
  `product_image` VARCHAR(1000) DEFAULT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_idx` (`order_id`),
  KEY `order_items_product_id_idx` (`product_id`),
  CONSTRAINT `order_items_order_fk`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `coupons` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `discount_type` ENUM('PERCENT','FIXED') NOT NULL DEFAULT 'PERCENT',
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order` DECIMAL(10,2) DEFAULT NULL,
  `max_uses` INT DEFAULT NULL,
  `used_count` INT NOT NULL DEFAULT 0,
  `expires_at` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wishlist_items` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_user_product_unique` (`user_id`, `product_id`),
  KEY `wishlist_product_id_idx` (`product_id`),
  CONSTRAINT `wishlist_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_product_fk`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Newsletter
-- ----------------------------
CREATE TABLE `newsletter_subscribers` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `status` ENUM('ACTIVE','UNSUBSCRIBED') NOT NULL DEFAULT 'ACTIVE',
  `source` VARCHAR(100) DEFAULT 'website',
  `welcome_email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `subscribed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Contact form
-- ----------------------------
CREATE TABLE `contact_messages` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('NEW','READ','REPLIED','ARCHIVED') NOT NULL DEFAULT 'NEW',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contact_messages_status_idx` (`status`),
  KEY `contact_messages_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Sample seed (optional — delete if you only want empty tables)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `product_count`) VALUES
('cat-laptops', 'Laptops', 'laptops', 'Portable power for work and play', NULL, 0),
('cat-desktops', 'Desktop PCs', 'desktop-pcs', 'Custom and pre-built desktops', NULL, 0),
('cat-servers', 'Servers', 'servers', 'Tower, rack, and NAS servers', NULL, 0),
('cat-gaming-pcs', 'Gaming PCs', 'gaming-pcs', 'Prebuilt RTX gaming desktops', NULL, 0),
('cat-monitors', 'Monitors', 'monitors', '4K, ultrawide and gaming displays', NULL, 0),
('cat-peripherals', 'Peripherals', 'peripherals', 'Keyboards, mice, and headsets', NULL, 0);

INSERT INTO `brands` (`id`, `name`, `slug`, `logo`) VALUES
('br-asus', 'Asus', 'asus', NULL),
('br-dell', 'Dell', 'dell', NULL),
('br-hp', 'HP', 'hp', NULL),
('br-msi', 'MSI', 'msi', NULL),
('br-acer', 'Acer', 'acer', NULL),
('br-logitech', 'Logitech', 'logitech', NULL);

-- Auth seed (bcrypt hashes)
-- Admin: admin@dezyon.store / admin123
-- User:  user@dezyon.store  / user123
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
(
  'user-admin-001',
  'Store Admin',
  'admin@dezyon.store',
  '$2b$10$vrhyJQzjmqU1nw.8H6VFbebzxroV5/NF8UL664NLHucIpQghdr/tC',
  'ADMIN'
),
(
  'user-customer-001',
  'Demo Customer',
  'user@dezyon.store',
  '$2b$10$ygx0jh9UnwoEdRU88Jue7.8CtsXbRfku2Eq/PHoi2hiWKgIDG8Yda',
  'CUSTOMER'
);
