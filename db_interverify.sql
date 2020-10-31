/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : db_interverify

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-11-01 00:19:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbl_user
-- ----------------------------
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(20) NOT NULL,
  `candidate_name_first` varchar(50) DEFAULT NULL,
  `candidate_name_last` varchar(50) DEFAULT NULL,
  `candidate_email` varchar(100) DEFAULT NULL,
  `verify_photo` varchar(100) DEFAULT NULL,
  `verify_idcard` varchar(100) DEFAULT NULL,
  `verify_result` decimal(4,2) DEFAULT NULL,
  `date_of_interview` datetime DEFAULT NULL,
  `social_link` text DEFAULT NULL,
  `interviewer_name_first` varchar(50) DEFAULT NULL,
  `interviewer_name_last` varchar(50) DEFAULT NULL,
  `interviewer_email` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of tbl_user
-- ----------------------------
