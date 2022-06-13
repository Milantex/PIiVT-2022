/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 100417
Source Host           : localhost:3306
Source Database       : piivt_app

Target Server Type    : MYSQL
Target Server Version : 100417
File Encoding         : 65001

Date: 2022-06-13 13:15:03
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', 'Danijelova 32', '2', null, 'Beograd', '+381113094095', '8', '0');
INSERT INTO `address` VALUES ('2', 'Neka nova adresa 33c', '2', '5', 'Belgrade', '+381666667', '5', '1');
INSERT INTO `address` VALUES ('3', 'Kumodraska 2', '2', '3', 'Beograd', '+381113094095', '5', '0');
INSERT INTO `address` VALUES ('4', 'Danijelova 32', '2', '21', 'Beograd', '+381113094095', '5', '1');
INSERT INTO `address` VALUES ('5', 'Danijelova 32', '1', '4', 'Beograd', '+381113094094', '8', '1');
INSERT INTO `address` VALUES ('6', 'Prva adresa dodata kroz profil 12', '4', '42', 'Belgrade', '+381112222222', '5', '1');
INSERT INTO `address` VALUES ('7', 'Test izmena 11', '1', '11', 'Belgrade', '+3811133232323', '5', '1');
INSERT INTO `address` VALUES ('8', 'Dodavanje adrese 5', '3', '12', 'Novi Sad', '+3816999999', '5', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of administrator
-- ----------------------------
INSERT INTO `administrator` VALUES ('1', 'admin', '$2b$10$mR9cdA3vOKvs2Ug.5wLvcuh3fEIm7qdS6Fofc4T7LSk..YNQnXiOG', '2022-05-23 15:35:09', '1');
INSERT INTO `administrator` VALUES ('2', 'administrator', '$2b$10$.I.71G5pvIIXbbYka5fzO.ITueBDwiz6BWisQMDWyXb/bgorNNuii', '2022-05-23 16:07:04', '0');
INSERT INTO `administrator` VALUES ('4', 'administrator-dva', '$2b$10$yCd8maWT9TO3PbTorZDykOTKum4hztr4.2JYBg9LiuMEqc/.0YDgy', '2022-05-23 16:10:13', '1');
INSERT INTO `administrator` VALUES ('8', 'administrator-tri', '$2b$10$FV4WaOfQCTvCuV8rGZu8kuguQBFvwAsC8DG3RylQ6E5OVB68SVY7a', '2022-06-06 17:14:23', '1');
INSERT INTO `administrator` VALUES ('9', 'administrator-cetiri', '$2b$10$Sh6Gk18B9jf4ncjFE10NSek6LLDf45xtQQoc2oEo1izMqlMoBknke', '2022-06-06 17:16:22', '1');
INSERT INTO `administrator` VALUES ('10', 'administrator-pet', '$2b$10$zXYpvrWTGgj4U5blMVmt3eVizwRB1/EXL0haFIK2xbiH.14dkItG2', '2022-06-06 17:18:03', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES ('2', '8', '2022-06-01 15:04:33');
INSERT INTO `cart` VALUES ('3', '8', '2022-06-01 15:13:47');
INSERT INTO `cart` VALUES ('5', '8', '2022-06-01 17:20:04');
INSERT INTO `cart` VALUES ('6', '8', '2022-06-01 17:22:05');
INSERT INTO `cart` VALUES ('7', '8', '2022-06-10 15:41:04');
INSERT INTO `cart` VALUES ('8', '8', '2022-06-10 16:58:21');
INSERT INTO `cart` VALUES ('9', '8', '2022-06-10 17:05:53');
INSERT INTO `cart` VALUES ('10', '8', '2022-06-10 17:31:46');
INSERT INTO `cart` VALUES ('11', '5', '2022-06-11 22:51:29');

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cart_content
-- ----------------------------
INSERT INTO `cart_content` VALUES ('2', '3', '2', '2');
INSERT INTO `cart_content` VALUES ('3', '3', '1', '5');
INSERT INTO `cart_content` VALUES ('8', '6', '3', '1');
INSERT INTO `cart_content` VALUES ('9', '2', '2', '2');
INSERT INTO `cart_content` VALUES ('10', '2', '3', '1');
INSERT INTO `cart_content` VALUES ('11', '5', '1', '2');
INSERT INTO `cart_content` VALUES ('12', '5', '3', '1');
INSERT INTO `cart_content` VALUES ('13', '7', '1', '3');
INSERT INTO `cart_content` VALUES ('14', '7', '2', '6');
INSERT INTO `cart_content` VALUES ('15', '7', '11', '2');
INSERT INTO `cart_content` VALUES ('16', '8', '1', '5');
INSERT INTO `cart_content` VALUES ('17', '8', '2', '2');
INSERT INTO `cart_content` VALUES ('18', '8', '3', '2');
INSERT INTO `cart_content` VALUES ('19', '9', '1', '1');
INSERT INTO `cart_content` VALUES ('20', '10', '1', '1');
INSERT INTO `cart_content` VALUES ('21', '11', '1', '3');
INSERT INTO `cart_content` VALUES ('22', '11', '2', '1');
INSERT INTO `cart_content` VALUES ('23', '11', '3', '2');
INSERT INTO `cart_content` VALUES ('24', '11', '11', '1');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('13', 'Kineska kuhinja');
INSERT INTO `category` VALUES ('2', 'Kuvana jela');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of ingredient
-- ----------------------------
INSERT INTO `ingredient` VALUES ('1', 'Belo brašno', '1');
INSERT INTO `ingredient` VALUES ('4', 'Čoko krem', '1');
INSERT INTO `ingredient` VALUES ('5', 'Džem', '1');
INSERT INTO `ingredient` VALUES ('2', 'Heljdino brašno', '1');
INSERT INTO `ingredient` VALUES ('3', 'Integralno brašno', '1');
INSERT INTO `ingredient` VALUES ('14', 'Jaja', '3');
INSERT INTO `ingredient` VALUES ('12', 'Maslinovo ulje', '3');
INSERT INTO `ingredient` VALUES ('8', 'Meso', '2');
INSERT INTO `ingredient` VALUES ('7', 'Povrće', '2');
INSERT INTO `ingredient` VALUES ('6', 'Začini', '2');
INSERT INTO `ingredient` VALUES ('11', 'Zelena salata', '3');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of item
-- ----------------------------
INSERT INTO `item` VALUES ('2', 'Kroasan sa cokoladom', 'Opis stavke koja ze zove \"Kroasan sa cokoladom\" ide ovde.', '1', '1');
INSERT INTO `item` VALUES ('3', 'Item 2', 'Drugi opis neke stavke.', '1', '1');
INSERT INTO `item` VALUES ('8', 'Bavarska kifla', 'Neki opis moze da ide ovde i duzina tog opisa mora da bude veca ili jednaka 32.', '1', '1');
INSERT INTO `item` VALUES ('9', 'Nova stavka 11', 'Neki opis koji ima vise od 32 karantera za novu stavku...', '1', '1');
INSERT INTO `item` VALUES ('10', 'Neki naziv salate ide ovde', 'Ovo je opis neke salate koja je dodata kroz CMS deo za administratora.', '3', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of item_ingredient
-- ----------------------------
INSERT INTO `item_ingredient` VALUES ('1', '2', '1');
INSERT INTO `item_ingredient` VALUES ('23', '2', '4');
INSERT INTO `item_ingredient` VALUES ('2', '3', '1');
INSERT INTO `item_ingredient` VALUES ('3', '3', '4');
INSERT INTO `item_ingredient` VALUES ('4', '3', '6');
INSERT INTO `item_ingredient` VALUES ('17', '8', '1');
INSERT INTO `item_ingredient` VALUES ('18', '8', '3');
INSERT INTO `item_ingredient` VALUES ('16', '8', '4');
INSERT INTO `item_ingredient` VALUES ('19', '9', '3');
INSERT INTO `item_ingredient` VALUES ('20', '9', '4');
INSERT INTO `item_ingredient` VALUES ('21', '10', '11');
INSERT INTO `item_ingredient` VALUES ('22', '10', '12');

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of item_size
-- ----------------------------
INSERT INTO `item_size` VALUES ('1', '2', '1', '250.00', '240.00', '1');
INSERT INTO `item_size` VALUES ('2', '2', '3', '500.00', '480.00', '1');
INSERT INTO `item_size` VALUES ('3', '3', '1', '75.00', '53.00', '1');
INSERT INTO `item_size` VALUES ('11', '8', '1', '70.00', '205.00', '1');
INSERT INTO `item_size` VALUES ('12', '8', '3', '130.00', '410.00', '1');
INSERT INTO `item_size` VALUES ('13', '9', '1', '100.00', '120.00', '1');
INSERT INTO `item_size` VALUES ('14', '10', '1', '250.00', '60.00', '1');
INSERT INTO `item_size` VALUES ('15', '10', '4', '750.00', '180.00', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('2', '2', '1', '2022-06-10 17:31:42', '2022-06-01 15:13:34', 'aa', 'sent', '3', '');
INSERT INTO `order` VALUES ('5', '3', '2', '2022-06-08 14:43:43', '2022-06-01 23:30:00', null, 'rejected', '4', 'Sve je bilo okej.');
INSERT INTO `order` VALUES ('6', '5', '2', '2022-06-10 17:30:42', '2022-06-01 23:30:00', null, 'sent', '4', 'Ovo je tekst.');
INSERT INTO `order` VALUES ('7', '6', '2', '2022-06-02 10:05:48', '2022-06-01 23:30:00', null, 'canceled', null, null);
INSERT INTO `order` VALUES ('8', '7', '3', '2022-06-10 17:18:51', '2022-06-10 20:30:00', null, 'canceled', null, null);
INSERT INTO `order` VALUES ('9', '8', '3', '2022-06-10 17:21:25', '2022-06-10 20:35:00', null, 'accepted', null, null);
INSERT INTO `order` VALUES ('10', '9', '3', '2022-06-10 17:31:32', '2022-06-10 21:15:00', null, 'sent', '5', 'Ocena 5!');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of photo
-- ----------------------------
INSERT INTO `photo` VALUES ('5', '1aef4172-177c-47ad-b5b4-7cb8c53249b4-sendvic.jpg', 'uploads/2022/06/1aef4172-177c-47ad-b5b4-7cb8c53249b4-sendvic.jpg', '9');
INSERT INTO `photo` VALUES ('7', 'bf097183-0760-4df1-bfe4-fb6c0d4d92c7-kifla-b-v2.jpg', 'uploads/2022/06/bf097183-0760-4df1-bfe4-fb6c0d4d92c7-kifla-b-v2.jpg', '2');
INSERT INTO `photo` VALUES ('8', '9e8b8d6f-0e18-43e8-b29c-e159a9cbdd27-salata.jpg', 'uploads/2022/06/9e8b8d6f-0e18-43e8-b29c-e159a9cbdd27-salata.jpg', '10');
INSERT INTO `photo` VALUES ('9', '8b8f2cb6-7555-4dc6-a33b-6063c5166b77-11377-bavarske-kifle_zoom.jpg', 'uploads/2022/06/8b8f2cb6-7555-4dc6-a33b-6063c5166b77-11377-bavarske-kifle_zoom.jpg', '8');
INSERT INTO `photo` VALUES ('10', '482596bb-b711-49a4-813a-24e2fe00a9fc-posni-peciva.jpg', 'uploads/2022/06/482596bb-b711-49a4-813a-24e2fe00a9fc-posni-peciva.jpg', '3');

-- ----------------------------
-- Table structure for size
-- ----------------------------
DROP TABLE IF EXISTS `size`;
CREATE TABLE `size` (
  `size_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `uq_size_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of size
-- ----------------------------
INSERT INTO `size` VALUES ('3', 'Large porcija');
INSERT INTO `size` VALUES ('2', 'Medium porcjia');
INSERT INTO `size` VALUES ('1', 'Mini porcija');
INSERT INTO `size` VALUES ('5', 'Ultra large porcija');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'mail@domain.com', '$2a$10$uarLIcra101ql26kL2mLy.oPlDdZcusVt0.zYB58S18xcd52I7//C', 'Petar', 'Perić', '0', '123-456', null);
INSERT INTO `user` VALUES ('4', 'milantex88@yahoo.com', '$2a$10$uarLIcra101ql26kL2mLy.oPlDdZcusVt0.zYB58S18xcd52I7//C', 'Milan', 'Tair', '0', null, null);
INSERT INTO `user` VALUES ('5', 'milan.tair@gmail.com', '$2b$10$qMkyLzfshtBiOA1EofYmiuZHhN7MOErXJBUNhLR75tV8cXSiVjnIm', 'Milan', 'Tair', '1', null, null);
INSERT INTO `user` VALUES ('8', 'mtair@singidunum.ac.rs', '$2a$10$uarLIcra101ql26kL2mLy.oPlDdZcusVt0.zYB58S18xcd52I7//C', 'Test', 'User', '1', null, null);
INSERT INTO `user` VALUES ('10', 'mtair@singidunum.ac.sr', '$2b$10$sWErAhcZfFK8BD4BxZYN1Oa4yvBa3b8QcE.fTxbokfQbuwwe4IHF2', 'Test', 'User', '0', '00cd0174-bad5-4da9-8979-a4ad275b84f4', null);
INSERT INTO `user` VALUES ('11', 'mtair@singidunum.com', '$2b$10$LIn8ZujtYOutFG2AC0mhXekLMov4EfAdcK1NsQkHWpZwCfCYPGu3G', 'Test', 'User', '0', 'ba912d24-a4a8-4e43-9eca-1691b6a5a42f', null);
INSERT INTO `user` VALUES ('12', 'mtair@test.com', '$2b$10$1iqd9EC1d.teCeDZd7W8/.32VQeW5u6gxARxuVLhma3LFvdZwiqDG', 'Milan', 'Tair', '0', '5766f6a6-0d9e-458a-a820-90c3f828cee6', null);
SET FOREIGN_KEY_CHECKS=1;
