/*
 Navicat Premium Data Transfer

 Source Server         : youdo
 Source Server Type    : SQLite
 Source Server Version : 3008008
 Source Database       : main

 Target Server Type    : SQLite
 Target Server Version : 3008008
 File Encoding         : utf-8

 Date: 02/25/2017 00:21:53 AM
*/

PRAGMA foreign_keys = false;

-- ----------------------------
--  Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS "address";
CREATE TABLE "address" (
	 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "rooms" text,
	 "metro" TEXT,
	 "street" TEXT,
	 "house_number" text,
	 "floor" text,
	 "floors" TEXT,
	 "total_sq" TEXT,
	 "live_sq" TEXT,
	 "kitchen_sq" TEXT,
	 "day" TEXT,
	 "month" TEXT,
	 "year" TEXT,
	 "base" TEXT,
	 "price" text,
	 "currency" TEXT,
	 "observation" TEXT,
	 "metro_name" TEXT,
	 "distric" TEXT,
	 "distance_center" text,
	 "duration_center" TEXT,
	 "distance_metro" text,
	 "duration_metro" TEXT,
	 "lat" TEXT,
	 "lad" TEXT
);
INSERT INTO "main".sqlite_sequence (name, seq) VALUES ("address", '76250');

PRAGMA foreign_keys = true;
