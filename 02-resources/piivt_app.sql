/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 100417
Source Host           : localhost:3306
Source Database       : piivt_app

Target Server Type    : MYSQL
Target Server Version : 100417
File Encoding         : 65001

Date: 2022-06-03 10:51:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', 'Neka ulica 22', '1', '5', 'Belgrad', '+3816699999999', '1', '1');
INSERT INTO `address` VALUES ('2', 'Neka nova adresa', '2', '4', 'belgrade', '+3816666666666', '8', '1');
INSERT INTO `address` VALUES ('3', 'Kumodraska 2', '2', null, 'Beograd', '+381113094095', '8', '1');
INSERT INTO `address` VALUES ('4', 'Danijelova 32', '2', null, 'Beograd', '+381113094095', '8', '0');

-- ----------------------------
-- Table structure for administrator
-- ----------------------------
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of administrator
-- ----------------------------
INSERT INTO `administrator` VALUES ('1', 'admin', '...', '2022-05-23 15:35:09', '1');
INSERT INTO `administrator` VALUES ('2', 'administrator', '$2b$10$.I.71G5pvIIXbbYka5fzO.ITueBDwiz6BWisQMDWyXb/bgorNNuii', '2022-05-23 16:07:04', '1');
INSERT INTO `administrator` VALUES ('4', 'administrator-dva', '$2b$10$yCd8maWT9TO3PbTorZDykOTKum4hztr4.2JYBg9LiuMEqc/.0YDgy', '2022-05-23 16:10:13', '1');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES ('1', '1', '2022-05-27 16:26:40');
INSERT INTO `cart` VALUES ('2', '8', '2022-06-01 15:04:33');
INSERT INTO `cart` VALUES ('3', '8', '2022-06-01 15:13:47');
INSERT INTO `cart` VALUES ('5', '8', '2022-06-01 17:20:04');
INSERT INTO `cart` VALUES ('6', '8', '2022-06-01 17:22:05');

-- ----------------------------
-- Table structure for cart_content
-- ----------------------------
DROP TABLE IF EXISTS `cart_content`;
CREATE TABLE `cart_content` (
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cart_content
-- ----------------------------
INSERT INTO `cart_content` VALUES ('2', '3', '2', '2');
INSERT INTO `cart_content` VALUES ('3', '3', '1', '5');
INSERT INTO `cart_content` VALUES ('8', '6', '3', '1');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('9', 'Ca4rt34tertgerg gh gf');
INSERT INTO `category` VALUES ('12', 'Kategorija A');
INSERT INTO `category` VALUES ('2', 'Kuvana jela');
INSERT INTO `category` VALUES ('10', 'New category');
INSERT INTO `category` VALUES ('1', 'Peciva');
INSERT INTO `category` VALUES ('4', 'Roštilj');
INSERT INTO `category` VALUES ('3', 'Salate');
INSERT INTO `category` VALUES ('6', 'Veganska jela');
INSERT INTO `category` VALUES ('5', 'Vegetarijanska jela');

-- ----------------------------
-- Table structure for ingredient
-- ----------------------------
DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE `ingredient` (
  `ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `uq_ingredient_name_category_id` (`name`,`category_id`),
  KEY `fk_ingredient_category_id` (`category_id`),
  CONSTRAINT `fk_ingredient_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of ingredient
-- ----------------------------
INSERT INTO `ingredient` VALUES ('1', 'Belo brašno', '1');
INSERT INTO `ingredient` VALUES ('4', 'Čoko krem', '1');
INSERT INTO `ingredient` VALUES ('5', 'Džem', '1');
INSERT INTO `ingredient` VALUES ('2', 'Heljdino brašno', '1');
INSERT INTO `ingredient` VALUES ('3', 'Integralno brašno', '1');
INSERT INTO `ingredient` VALUES ('8', 'Meso', '2');
INSERT INTO `ingredient` VALUES ('7', 'Povrće', '2');
INSERT INTO `ingredient` VALUES ('6', 'Začini', '2');

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
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

-- ----------------------------
-- Records of item
-- ----------------------------
INSERT INTO `item` VALUES ('2', 'Item 1', 'Opis stavke 1', '1', '1');
INSERT INTO `item` VALUES ('3', 'Item 2', 'Drugi opis neke stavke.', '1', '1');

-- ----------------------------
-- Table structure for item_ingredient
-- ----------------------------
DROP TABLE IF EXISTS `item_ingredient`;
CREATE TABLE `item_ingredient` (
  `item_ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `ingredient_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`item_ingredient_id`),
  UNIQUE KEY `uq_item_ingredient_item_id_ingredient_id` (`item_id`,`ingredient_id`),
  KEY `fk_ingredient_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_ingredient_ingredient_id` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ingredient_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of item_ingredient
-- ----------------------------
INSERT INTO `item_ingredient` VALUES ('1', '2', '1');
INSERT INTO `item_ingredient` VALUES ('2', '3', '1');
INSERT INTO `item_ingredient` VALUES ('3', '3', '4');
INSERT INTO `item_ingredient` VALUES ('4', '3', '6');

-- ----------------------------
-- Table structure for item_size
-- ----------------------------
DROP TABLE IF EXISTS `item_size`;
CREATE TABLE `item_size` (
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

-- ----------------------------
-- Records of item_size
-- ----------------------------
INSERT INTO `item_size` VALUES ('1', '2', '1', '250.00', '240.00', '1');
INSERT INTO `item_size` VALUES ('2', '2', '3', '500.00', '480.00', '1');
INSERT INTO `item_size` VALUES ('3', '3', '1', '75.00', '53.00', '1');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('2', '2', '1', '2022-06-01 15:13:33', '2022-06-01 15:13:34', 'aa', 'pending', null, null);
INSERT INTO `order` VALUES ('5', '3', '2', '2022-06-02 09:50:18', '2022-06-01 23:30:00', null, 'sent', '4', 'Sve je bilo okej.');
INSERT INTO `order` VALUES ('6', '5', '2', '2022-06-01 17:20:36', '2022-06-01 23:30:00', null, 'pending', null, null);
INSERT INTO `order` VALUES ('7', '6', '2', '2022-06-02 10:05:48', '2022-06-01 23:30:00', null, 'canceled', null, null);

-- ----------------------------
-- Table structure for photo
-- ----------------------------
DROP TABLE IF EXISTS `photo`;
CREATE TABLE `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8_unicode_ci NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_item_id` (`item_id`),
  CONSTRAINT `fk_photo_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of photo
-- ----------------------------

-- ----------------------------
-- Table structure for size
-- ----------------------------
DROP TABLE IF EXISTS `size`;
CREATE TABLE `size` (
  `size_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `uq_size_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of size
-- ----------------------------
INSERT INTO `size` VALUES ('1', 'Mala porcija');
INSERT INTO `size` VALUES ('2', 'Srednja porcjia');
INSERT INTO `size` VALUES ('3', 'Velika porcija');
INSERT INTO `size` VALUES ('4', 'VIP size');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `forename` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `activation_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_reset_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`) USING BTREE,
  UNIQUE KEY `uq_user_password_reset_code` (`password_reset_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'mail@domain.com', '####', 'Pera', 'Peric', '0', '123-456', null);
INSERT INTO `user` VALUES ('4', 'milantex88@yahoo.com', '$2b$10$SeJisPaRkl6IOC1bt9Fxiu2Z5bdeYTGLSW56pTswRchHe6h4baIYa', 'Milan', 'Tair', '1', null, null);
INSERT INTO `user` VALUES ('5', 'milan.tair@gmail.com', '$2b$10$zt7D60nP9msf.XSxaSqNquUsqOFHU4DMLBl3XsjF.sBdXjmtsU/0S', 'Milan', 'Tair', '1', null, null);
INSERT INTO `user` VALUES ('8', 'mtair@singidunum.ac.rs', '$2b$10$A1if8QnHKYOm5OeKW8IcieMoEjopX8Uic1wDNlJyCN8ABwBe5EMCy', 'Test', 'User', '0', '1f7c78b1-9c4a-4114-8d6c-0aca5459144e', null);
SET FOREIGN_KEY_CHECKS=1;
