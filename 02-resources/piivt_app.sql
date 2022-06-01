/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `piivt_app`;
CREATE DATABASE IF NOT EXISTS `piivt_app` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `piivt_app`;

DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `street_and_nmber` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `floor` int(10) unsigned DEFAULT NULL,
  `apartment` int(10) unsigned DEFAULT NULL,
  `city` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `phone_number` varchar(24) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`address_id`),
  KEY `fk_address_user_id` (`user_id`),
  CONSTRAINT `fk_address_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `address` (`address_id`, `street_and_nmber`, `floor`, `apartment`, `city`, `phone_number`, `user_id`, `is_active`) VALUES
	(1, 'Neka ulica 22', 1, 5, 'Belgrad', '+3816699999999', 1, 1),
	(2, 'Neka nova adresa', 2, 4, 'belgrade', '+3816666666666', 8, 1);

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`, `is_active`) VALUES
	(1, 'admin', '...', '2022-05-23 13:35:09', 1),
	(2, 'administrator', '$2b$10$.I.71G5pvIIXbbYka5fzO.ITueBDwiz6BWisQMDWyXb/bgorNNuii', '2022-05-23 14:07:04', 1),
	(4, 'administrator-dva', '$2b$10$yCd8maWT9TO3PbTorZDykOTKum4hztr4.2JYBg9LiuMEqc/.0YDgy', '2022-05-23 14:10:13', 1);

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`) VALUES
	(1, 1, '2022-05-27 14:26:40'),
	(2, 8, '2022-06-01 13:04:33'),
	(3, 8, '2022-06-01 13:13:47'),
	(5, 8, '2022-06-01 15:20:04'),
	(6, 8, '2022-06-01 15:22:05');

DROP TABLE IF EXISTS `cart_content`;
CREATE TABLE IF NOT EXISTS `cart_content` (
  `cart_content_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int(10) unsigned NOT NULL,
  `item_size_id` int(10) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cart_content_id`),
  UNIQUE KEY `uq_cart_content_cart_id_item_size_it` (`cart_id`,`item_size_id`),
  KEY `fk_cart_content_cart_id` (`cart_id`),
  KEY `fk_cart_content_item_size_id` (`item_size_id`),
  CONSTRAINT `fk_cart_content_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_content_item_size_id` FOREIGN KEY (`item_size_id`) REFERENCES `item_size` (`item_size_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `cart_content` (`cart_content_id`, `cart_id`, `item_size_id`, `quantity`) VALUES
	(2, 3, 2, 2),
	(3, 3, 1, 5),
	(8, 6, 3, 1);

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `category` (`category_id`, `name`) VALUES
	(9, 'Ca4rt34tertgerg gh gf'),
	(12, 'Kategorija A'),
	(2, 'Kuvana jela'),
	(10, 'New category'),
	(1, 'Peciva'),
	(4, 'Roštilj'),
	(3, 'Salate'),
	(6, 'Veganska jela'),
	(5, 'Vegetarijanska jela');

DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE IF NOT EXISTS `ingredient` (
  `ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `uq_ingredient_name_category_id` (`name`,`category_id`),
  KEY `fk_ingredient_category_id` (`category_id`),
  CONSTRAINT `fk_ingredient_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `ingredient` (`ingredient_id`, `name`, `category_id`) VALUES
	(1, 'Belo brašno', 1),
	(4, 'Čoko krem', 1),
	(5, 'Džem', 1),
	(2, 'Heljdino brašno', 1),
	(3, 'Integralno brašno', 1),
	(8, 'Meso', 2),
	(7, 'Povrće', 2),
	(6, 'Začini', 2);

DROP TABLE IF EXISTS `item`;
CREATE TABLE IF NOT EXISTS `item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `uq_item_name_category_id` (`name`,`category_id`),
  KEY `fk_item_category_id` (`category_id`),
  CONSTRAINT `fk_item_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `item` (`item_id`, `name`, `description`, `category_id`, `is_active`) VALUES
	(2, 'Item 1', 'Opis stavke 1', 1, 1),
	(3, 'Item 2', 'Drugi opis neke stavke.', 1, 1);

DROP TABLE IF EXISTS `item_ingredient`;
CREATE TABLE IF NOT EXISTS `item_ingredient` (
  `item_ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `ingredient_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`item_ingredient_id`),
  UNIQUE KEY `uq_item_ingredient_item_id_ingredient_id` (`item_id`,`ingredient_id`),
  KEY `fk_ingredient_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_ingredient_ingredient_id` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ingredient_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `item_ingredient` (`item_ingredient_id`, `item_id`, `ingredient_id`) VALUES
	(1, 2, 1),
	(2, 3, 1),
	(3, 3, 4),
	(4, 3, 6);

DROP TABLE IF EXISTS `item_size`;
CREATE TABLE IF NOT EXISTS `item_size` (
  `item_size_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `size_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `kcal` decimal(10,2) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`item_size_id`),
  UNIQUE KEY `uq_item_size_item_id_size_id` (`item_id`,`size_id`),
  KEY `fk_item_size_size_id` (`size_id`),
  CONSTRAINT `fk_item_size_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_item_size_size_id` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `item_size` (`item_size_id`, `item_id`, `size_id`, `price`, `kcal`, `is_active`) VALUES
	(1, 2, 1, 250.00, 240.00, 1),
	(2, 2, 3, 500.00, 480.00, 1),
	(3, 3, 1, 75.00, 53.00, 1);

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int(10) unsigned NOT NULL,
  `address_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deliver_at` datetime NOT NULL,
  `note` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('pending','canceled','accepted','rejected','sent') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'pending',
  `mark_value` enum('1','2','3','4','5') COLLATE utf8_unicode_ci DEFAULT NULL,
  `mark_note` text COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  KEY `fk_order_address_id` (`address_id`),
  CONSTRAINT `fk_order_address_id` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `order` (`order_id`, `cart_id`, `address_id`, `created_at`, `deliver_at`, `note`, `status`, `mark_value`, `mark_note`) VALUES
	(2, 2, 1, '2022-06-01 13:13:33', '2022-06-01 15:13:34', 'aa', 'pending', NULL, NULL),
	(5, 3, 2, '2022-06-01 15:19:52', '2022-06-01 23:30:00', NULL, 'pending', NULL, NULL),
	(6, 5, 2, '2022-06-01 15:20:36', '2022-06-01 23:30:00', NULL, 'pending', NULL, NULL),
	(7, 6, 2, '2022-06-01 15:22:16', '2022-06-01 23:30:00', NULL, 'pending', NULL, NULL);

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8_unicode_ci NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_item_id` (`item_id`),
  CONSTRAINT `fk_photo_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `size`;
CREATE TABLE IF NOT EXISTS `size` (
  `size_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `uq_size_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `size` (`size_id`, `name`) VALUES
	(1, 'Mala porcija'),
	(2, 'Srednja porcjia'),
	(3, 'Velika porcija'),
	(4, 'VIP size');

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `forename` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `activation_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `ua_user_activation_code` (`activation_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forename`, `surname`, `is_active`, `activation_code`) VALUES
	(1, 'mail@domain.com', '####', 'Pera', 'Peric', 0, '123-456'),
	(4, 'milantex88@yahoo.com', '$2b$10$SeJisPaRkl6IOC1bt9Fxiu2Z5bdeYTGLSW56pTswRchHe6h4baIYa', 'Milan', 'Tair', 1, NULL),
	(5, 'milan.tair@gmail.com', '$2b$10$zt7D60nP9msf.XSxaSqNquUsqOFHU4DMLBl3XsjF.sBdXjmtsU/0S', 'Milan', 'Tair', 1, NULL),
	(8, 'mtair@singidunum.ac.rs', '$2b$10$b4S8Om6TomcCCamsB92BheOFm44FkaL0e8Q9lX77J8BAAwfiZUbl2', 'Test', 'User', 0, '1f7c78b1-9c4a-4114-8d6c-0aca5459144e');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
