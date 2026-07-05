-- Import SQL for migrations:
-- 2026_06_21_000000_create_novedades_privadas_table.php
-- 2026_06_21_000001_add_active_session_id_to_users_table.php

SET NAMES utf8mb4;

CREATE TABLE `novedades_privadas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order` VARCHAR(255) NULL,
  `image` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  `type` VARCHAR(255) NULL,
  `text` LONGTEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `users`
  ADD COLUMN `active_session_id` VARCHAR(255) NULL AFTER `remember_token`;
