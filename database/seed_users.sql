-- Run if you already imported schema without auth users.
-- Safe to re-run: replaces these two demo accounts.

USE `dezyon_store`;

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
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password_hash` = VALUES(`password_hash`),
  `role` = VALUES(`role`);
