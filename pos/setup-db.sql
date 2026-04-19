-- POS Cafe Database Schema
SET FOREIGN_KEY_CHECKS=0;
CREATE DATABASE IF NOT EXISTS cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS `tables`;
SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `pwd` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `category` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `c_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `floor` VARCHAR(100) NOT NULL,
  `capacity` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userid` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50),
  `items` LONGTEXT,
  `total_amount` DECIMAL(10, 2),
  `paying_status` VARCHAR(50),
  `session_id` INT,
  `payment_method` VARCHAR(50)
);
INSERT INTO `items` (`name`, `description`, `price`, `category`) VALUES ('Espresso', 'Strong black coffee', 2.50, 'Beverages'), ('Cappuccino', 'Creamy coffee with milk foam', 3.50, 'Beverages'), ('Iced Tea', 'Refreshing cold tea', 2.00, 'Beverages'), ('Sandwich', 'Fresh sandwich with assorted fillings', 5.00, 'Food'), ('Pastry', 'Fresh baked pastry', 3.00, 'Food');
INSERT INTO `category` (`c_name`) VALUES ('Beverages'), ('Food'), ('Desserts');
INSERT INTO `tables` (`floor`, `capacity`) VALUES ('Ground Floor', 4), ('Ground Floor', 2), ('First Floor', 6);
INSERT INTO `user` (`username`, `email`, `pwd`) VALUES ('admin', 'admin@cafe.local', 'test123'), ('testuser', 'test@cafe.local', 'password123');
