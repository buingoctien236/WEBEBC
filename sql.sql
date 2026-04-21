-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: mrkit
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_account` varchar(100) NOT NULL,
  `log` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_logs`
--

LOCK TABLES `admin_logs` WRITE;
/*!40000 ALTER TABLE `admin_logs` DISABLE KEYS */;
INSERT INTO `admin_logs` VALUES (1,'hangle','Thêm sản phẩm mới: test','2025-12-24 15:06:00'),(2,'hangle','[DELETE_PRODUCT] Xóa sản phẩm: test (ID: 13)','2025-12-24 15:09:09'),(3,'hangle','[DELETE_PRODUCT] Xóa sản phẩm: test (ID: 14)','2025-12-24 15:09:09'),(4,'hangle','[DELETE_PRODUCT] Xóa sản phẩm: test (ID: 12)','2025-12-24 15:09:27'),(5,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Tẩy rửa dầu mỡ chai cam 750ml (ID: 7)','2025-12-24 15:12:07'),(6,'admin','[CREATE_NEWS] Thêm tin tức: đa (ID: 14)','2025-12-24 15:17:32'),(7,'admin','[UPDATE_NEWS] Cập nhật tin tức: đa111 (ID: 14)','2025-12-24 15:17:46'),(8,'admin','[DELETE_NEWS] Xóa tin tức: đa111 (ID: 14)','2025-12-24 15:17:53'),(9,'admin','[UPDATE_SPOTLIGHT] Cập nhật sản phẩm tiêu biểu','2025-12-24 15:24:22'),(10,'unknown','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-24 16:03:13'),(11,'unknown','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-24 16:04:01'),(12,'unknown','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-24 16:07:01'),(13,'admin','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-24 16:17:53'),(14,'admin','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-24 16:19:09'),(15,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Nước rửa tay hương hoa cam 450ml (ID: 7)','2025-12-25 08:59:51'),(16,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Tẩy rửa dầu mỡ Mr. Kit Pro 750ml (ID: 5)','2025-12-25 09:06:21'),(17,'hangle','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-25 09:27:03'),(18,'hangle','Thêm sản phẩm mới: Xịt tẩy rửa bếp 500ml','2025-12-25 09:34:24'),(19,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Bọt rửa tay hương bạc hà 450ml - An toàn trên da (ID: 6)','2025-12-25 09:38:37'),(20,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Bọt rửa tay hương bạc hà 450ml - An toàn trên da (ID: 7)','2025-12-25 09:40:17'),(21,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Bọt rửa tay hương nước hoa 450ml - An toàn trên da (ID: 4)','2025-12-25 09:41:12'),(22,'admin','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-25 10:19:56'),(23,'hangle','[UPDATE_BANNER] Cập nhật banner trang chủ (ID: 1)','2025-12-25 10:25:40'),(24,'hangle','[UPDATE_SPOTLIGHT] Cập nhật sản phẩm tiêu biểu','2025-12-25 10:29:16'),(25,'admin','[UPDATE_PRODUCT] Cập nhật sản phẩm: Bọt rửa tay hương hoa cam 450ml - An toàn trên da (ID: 7)','2025-12-25 10:38:45'),(26,'admin','[DELETE_PRODUCT] Xóa sản phẩm: Tẩy rửa dầu mỡ Mr. Kit Pro 750ml (ID: 5)','2025-12-25 10:39:01'),(27,'admin','Thêm sản phẩm mới: Xịt tẩy rửa kính 500ml','2025-12-25 10:43:17'),(28,'admin','Thêm sản phẩm mới: Xịt tẩy rửa đồ da sinh học 500ml','2025-12-25 10:44:58'),(29,'hangle','[UPDATE_PRODUCT] Cập nhật sản phẩm: Xịt tẩy rửa đồ da sinh học 500ml (ID: 17)','2025-12-25 10:52:57'),(30,'admin','[UPDATE_NEWS] Cập nhật tin tức: ? 11/11 SIÊU SALE NGÀY ĐÔI - ƯU ĐÃI GẤP BỘI ? (ID: 13)','2025-12-25 11:06:37'),(31,'admin','[UPDATE_PRODUCT] Cập nhật sản phẩm:(ID: 3)','2025-12-25 11:14:32'),(32,'admin','[UPDATE_PRODUCT] Cập nhật sản phẩm:(ID: 3)','2025-12-25 11:15:48');
/*!40000 ALTER TABLE `admin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','123456'),(2,'hangle','123456');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Banner1` varchar(500) DEFAULT NULL,
  `Banner2` varchar(500) DEFAULT NULL,
  `Banner3` varchar(500) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'https://res.cloudinary.com/dimrzqqk3/image/upload/v1766415968/tdr1mlulqyzmyp1hf0rl.jpg','https://res.cloudinary.com/dimrzqqk3/image/upload/v1766633140/hleyguyc0diovzrolfr4.png','https://res.cloudinary.com/dimrzqqk3/image/upload/v1766629623/qmjbuj9rgfro214qzmeu.jpg','2025-12-22 08:44:10','2025-12-25 03:25:40');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashsale_products`
--

DROP TABLE IF EXISTS `flashsale_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashsale_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `flashsale_id` int NOT NULL,
  `product_id` int NOT NULL,
  `flashsale_price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_flashsale_product` (`flashsale_id`,`product_id`),
  KEY `idx_flashsale_id` (`flashsale_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `flashsale_products_ibfk_1` FOREIGN KEY (`flashsale_id`) REFERENCES `flashsales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `flashsale_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashsale_products`
--

LOCK TABLES `flashsale_products` WRITE;
/*!40000 ALTER TABLE `flashsale_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `flashsale_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashsales`
--

DROP TABLE IF EXISTS `flashsales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashsales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('pending','active','ended') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_times` (`start_time`,`end_time`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashsales`
--

LOCK TABLES `flashsales` WRITE;
/*!40000 ALTER TABLE `flashsales` DISABLE KEYS */;
/*!40000 ALTER TABLE `flashsales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `HeaderImg` text,
  `HeaderContent` longtext,
  `MainImg` text,
  `MainContent` longtext NOT NULL,
  `FooterImg` text,
  `FooterContent` longtext,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (10,'Bí Quyết Để Căn Bếp Luôn Sáng Sạch, Mà Đôi Tay Vẫn Mềm Mại Như Trước','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376191/swvfpajasv8p9okguwhx.jpg','Các mẹ biết không, để căn bếp lúc nào cũng sáng bóng mà không phải “hi sinh đôi tay”, thì bí quyết nằm ngay ở chai Xịt Tẩy Đa Năng Mr.KIT ?','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376192/lpdbcmj2fopwhbs5rk5w.jpg','Chiết xuất từ thực vật tự nhiên, ứng dụng công nghệ sinh học tiên tiến từ Mỹ, xịt tẩy đa năng Mr.KIT giúp đánh bay dầu mỡ, cặn bẩn hữu cơ, mùi khó chịu chỉ trong vài phút nhưng vẫn an toàn tuyệt đối cho da tay, trẻ nhỏ và cả thú cưng.\r\nMột chai thôi mà “cân” được hết: bếp, bồn rửa, bàn ăn, tủ lạnh, lò vi sóng...\r\nKhông cay rát, không ăn mòn, sạch sâu với hương thơm dễ chịu và cảm giác an tâm.','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376194/vmytskurhbqbgvdakj4g.jpg','Mr.KIT – Trợ thủ đắc lực của những người yêu căn bếp tinh tươm, an lành.\r\n#MrKIT #Gemtek #XitTayDaNang #CongNgheSinhHocMy #SachSauLanhTinh #BaoVeGiaDinh #ThanThienMoiTruong ','2025-12-22 11:03:04'),(11,'CHẾ PHẨM SINH HỌC CÔ ĐẶC SC-1000 – ĐẶC TẨY DẦU MỠ VÀ CHẤT BẨN HỮU CƠ','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376438/ihdhnv9f4tmkdzlpfvep.jpg','SC-1000 là chế phẩm sinh học cô đặc thế hệ mới được phát triển từ công nghệ enzyme sinh học Gemtek (Hoa Kỳ) – giải pháp làm sạch xanh đang được tin dùng tại hơn 30 quốc gia.','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376439/zivngfgiipmbypjio1ui.jpg','? Phá vỡ cấu trúc dầu mỡ, làm sạch vượt trội chỉ sau 10–20 phút\r\n? 100% chiết xuất từ thực vật, được chứng nhận BioBasep & Biobased Certified\r\n? An toàn cho da tay, không chứa clo, amoniac, silicon hay chất tẩy hóa học\r\n? Thuần chay – Phân hủy sinh học hoàn toàn – Thân thiện môi trường\r\n? Tiết kiệm & linh hoạt: Pha loãng 1:2 đến 1:30 tùy theo nhu cầu tẩy rửa','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376440/j1j0rqkeylq5jndy2zfz.jpg','Dùng trong bếp ăn, nhà hàng, xưởng sản xuất, hay pha chế tẩy đa năng cho gia đình, SC-1000 an toàn trên mọi bề mặt, không độc hại, không để lại dư lượng hóa chất.\r\nMr.KIT – Sạch sâu, Lành tính.\r\n#MrKIT #Gemtek #XitTayDaNang #CongNgheSinhHocMy #SachSauLanhTinh #BaoVeGiaDinh #ThanThienMoiTruong ','2025-12-22 11:07:13'),(12,'Hội chợ Mùa Thu 2025: Mr.Kit khẳng định thương hiệu tiên phong “sống xanh” tại thị trường Việt Nam','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376836/hnnyepi0qc9fwtvhmkpg.jpg','Năm 2025, Mr.KIT ra đời với sứ mệnh mang đến những sản phẩm tẩy rửa sạch sâu – lành tính, thay thế hóa chất độc hại, bảo vệ sức khỏe con người và gìn giữ môi trường sống xanh.','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376838/v2frgfpfpvpxzl84my68.jpg','? Chính vì vậy, Mr.KIT được xây dựng trên 3 tiêu chí cốt lõi:\r\n✨ AN TOÀN: Thành phần hữu cơ, công nghệ sinh học nhập khẩu từ Gemtek (USA), không gây hại cho da tay và trẻ nhỏ.\r\n✨ HIỆU QUẢ: Làm sạch dầu mỡ, các chất bẩn hữu cơ, đường và máu trên mọi bề mặt nhanh chóng tiện lợi và an toàn.\r\n✨ BỀN VỮNG: Bao bì thân thiện, sản phẩm xanh góp phần lan tỏa lối sống an toàn – bền vững.\r\n? Mr.KIT mong muốn trở thành người bạn đồng hành của mọi gia đình và doanh nghiệp, mang tới không gian sạch - xanh, giúp bạn yên tâm tận hưởng cuộc sống.','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766376838/tratdayzygschj3fahb7.jpg','Các dòng sản phẩm chính của Mr.KIT:\r\n? Xịt tẩy đa năng: xử lý dầu mỡ, chất nhờn từ thủy/hải sản, máu động vật, các cặn bẩn hữu cơ và đường, vết bám mỡ cứng đầu.\r\n? Bọt rửa tay hữu cơ: dịu nhẹ, kháng khuẩn, an toàn cho mọi lứa tuổi.\r\n? Khám phá ngay Mr.KIT để trải nghiệm sự khác biệt từ sản phẩm công nghệ sinh học hoàn toàn organic.\r\n*Thành phần chính nhập khẩu từ GEMTEK Hoa Kỳ với đầy đủ các chứng nhận về an toàn môi trường, an toàn sinh học: NSF, USDA, Cefas.','2025-12-22 11:13:50'),(13,'? 11/11 SIÊU SALE NGÀY ĐÔI - ƯU ĐÃI GẤP BỘI ?','https://res.cloudinary.com/dbcv5gbos/image/upload/v1766377256/ddyfear2niyetlbgpkxr.jpg','Cơ hội sở hữu chất tẩy rửa “sạch sâu, lành tính, siêu tiết kiệm” đã đến cho ai nhanh tay ?\r\nToàn bộ sản phẩm nhà Mr.KIT đều thuần chay và chuẩn Organic theo tiêu chuẩn Hoa Kỳ. Không chỉ sạch mà còn bảo vệ làn da, bảo vệ cả gia đình.',NULL,'Ngày sale đôi, Mr.KIT chơi lớn:\r\n? Giảm ngay 20% toàn bộ sản phẩm\r\n? Mã giảm 35.000đ cho đơn từ 100.000đ\r\n? 1.111 đơn đầu tiên nhận thêm 10.000đ tiền m.ặt',NULL,'Nhanh tay mua ngay hôm nay để “sạch sâu, lành tính” mà vẫn tiết kiệm!','2025-12-22 11:15:44');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Tên sản phẩm',
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Mô tả ngắn về sản phẩm',
  `detailed_specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Thông số kỹ thuật chi tiết',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Giá gốc của sản phẩm',
  `sale_price` decimal(10,2) DEFAULT NULL COMMENT 'Giá khuyến mãi (nếu có)',
  `status` enum('sale','not_sale') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'not_sale' COMMENT 'Trạng thái: ''sale'' hoặc ''not_sale''',
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Chất tẩy rửa',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT (_utf8mb4'[]') COMMENT 'Danh sách URL ảnh sản phẩm (JSON array)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo sản phẩm',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật cuối',
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category`),
  KEY `idx_products_created_at` (`created_at`),
  KEY `idx_products_status` (`status`),
  KEY `idx_products_status_category` (`status`,`category`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Chất tẩy rửa SC-1000R 1l/chai Aqueous Cleanner Concentrate','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','? CHẾ PHẨM SINH HỌC CÔ ĐẶC SC1000 MR.KIT – GIẢI PHÁP TẨY RỬA XANH, AN TOÀN CHO MỌI KHÔNG GIAN\r\n\r\n\r\n\r\nỨng dụng công nghệ enzyme sinh học từ Mỹ (Gemtek) – Sản phẩm thuần chay, dịu nhẹ, thân thiện môi trường.\r\n\r\n\r\n\r\n? MÔ TẢ SẢN PHẨM\r\n\r\nSC1000 Mr.KIT là chế phẩm tẩy rửa sinh học cô đặc ứng dụng công nghệ enzyme phân huỷ tự nhiên từ Gemtek (Mỹ), giúp loại bỏ hiệu quả dầu mỡ, cặn bẩn, protein, đường và các chất hữu cơ bám dính mà không gây ăn mòn hay kích ứng da tay.\r\n\r\n\r\n\r\nChiết xuất hoàn toàn từ phụ phẩm thực vật như đậu nành, ngô, hạt cọ, hướng dương, hạt cải dầu,… sản phẩm được chứng nhận phân hủy sinh học, thuần chay (vegan-friendly) và không chứa hóa chất độc hại.\r\n\r\n\r\n\r\nVới tỉ lệ pha linh hoạt (1:2 – 1:50), SC1000 giúp người dùng tự tạo dung dịch tẩy rửa sinh học dùng cho gia đình, nhà hàng, khách sạn hoặc khu công nghiệp, tiết kiệm chi phí mà vẫn đảm bảo hiệu quả làm sạch vượt trội.\r\n\r\n\r\n\r\n? ƯU ĐIỂM NỔI BẬT\r\n\r\n✅ Tẩy sạch sinh học: Phân huỷ nhanh dầu mỡ, vết bẩn hữu cơ mà không cần chất tẩy mạnh.\r\n\r\n✅ An toàn cho da tay: Không chứa clo, amoniac, chất ăn mòn hay hương liệu tổng hợp.\r\n\r\n✅ Thuần chay & thân thiện môi trường: Nguyên liệu từ thực vật, dễ phân huỷ sinh học, không gây ô nhiễm nguồn nước.\r\n\r\n✅ Hiệu quả cao & tiết kiệm: Dạng cô đặc, chỉ cần pha loãng là có thể sử dụng cho nhiều mục đích khác nhau.\r\n\r\n\r\n\r\n? ỨNG DỤNG LINH HOẠT\r\n\r\n? Gia đình: Làm sạch bếp, sàn, bồn rửa, lò vi sóng, bề mặt bám dầu mỡ.\r\n\r\n? Nhà hàng, khách sạn: Tẩy rửa bề mặt chế biến, thiết bị inox, dụng cụ bếp.\r\n\r\n? Công nghiệp: Dùng trong khu chế biến, xưởng sản xuất, garage, bếp ăn công nghiệp.\r\n\r\n\r\n\r\n? Pha dung dịch vệ sinh sinh học: Pha loãng 1:2–1:50 dùng như dung dịch xịt tẩy đa năng Mr.KIT.\r\n\r\n\r\n\r\n? THÀNH PHẦN CHÍNH\r\n\r\nChiết xuất thực vật: đậu nành, ngô, hạt cọ, hướng dương, cải dầu.\r\n\r\nCồn béo & axit béo thực vật: giúp làm sạch sâu, không khô da.\r\n\r\nEnzyme sinh học tự nhiên: phân huỷ dầu mỡ, protein, đường.\r\n\r\nEste & sáp thực vật: tăng khả năng khử mùi, tạo hương thơm dễ chịu.\r\n\r\n\r\n\r\n? Không chứa: Clo, amoniac, paraben, silicon, chất tẩy tổng hợp, hóa chất ăn mòn.\r\n\r\n\r\n\r\n✨ HƯỚNG DẪN SỬ DỤNG\r\n\r\nPha loãng: 1 phần SC1000 với 2–50 phần nước tuỳ mức độ và phụ thuộc theo chất cần tẩy rửa.\r\n\r\nSử dụng: Dùng bình xịt, khăn hoặc máy phun để vệ sinh bề mặt.\r\n\r\nBảo quản: Đậy kín sau khi sử dụng, tránh ánh nắng trực tiếp.\r\n\r\n\r\n\r\n? THÔNG TIN SẢN PHẨM\r\n\r\nDung tích: Can 1L / 5L / 20L\r\n\r\nĐộ pH: ~9.5 (an toàn với da tay và bề mặt vật liệu)\r\n\r\nPhân loại: Chế phẩm tẩy rửa sinh học cô đặc\r\n\r\nNhà sản xuất: Công ty TNHH Công Nghệ Sinh Học EBC\r\n\r\nCông nghệ: Gemtek Products LLC – Mỹ\r\n\r\n\r\n\r\n? SC1000 Mr.KIT – Sức mạnh enzyme sinh học từ thiên nhiên, sạch sâu mà vẫn lành tính cho da và môi trường.',680000.00,NULL,'not_sale','SC-1000','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766628183/tzitu1ud15gatjnyc9fj.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766628185/qktz4ss7qway7dwrzfa3.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766628186/ce6qpepjc7vqdzngudxc.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766628187/rqrkzrdbhpmdhwovr9xl.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766628188/hib9mdo4nxam2kemzn7l.jpg\"]','2025-12-18 14:31:32','2025-12-25 02:03:08'),(2,'Chất tẩy rửa SC-1000R 10l/chai 1l/chai Aqueous Cleanner Concentrate','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','Vì 1 trái đất xanh',1500000.00,NULL,'not_sale','SC-1000','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766635634/scma2p4k5qpe4ivuwwrm.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766635637/qug7vwttcn7afqfibdts.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766635642/pbowhuj3kc0naumy54vz.jpg\"]','2025-12-18 14:38:04','2025-12-25 04:07:22'),(3,'Chất tẩy rửa SC-1000R 20l/chai 1l/chai Aqueous Cleanner Concentrate','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên.','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN.',2800000.00,NULL,'not_sale','SC-1000','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634464/ngfyc9nanutziiqhhe7l.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634473/hhkb8x1qe3fvpfn64dqb.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634477/a6szv0xzgv93rysyoi2y.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634481/icpfvfmpob5hylwmlc8f.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634670/fq72drhk85viia1jntsk.jpg\"]','2025-12-18 14:43:11','2025-12-25 04:15:48'),(4,'Bọt rửa tay hương nước hoa 450ml - An toàn trên da','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN',90000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766630470/oqrcgn1jlf8tundpvins.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766630471/rs69w0gmwdavguyqdxr6.jpg\"]','2025-12-18 14:46:58','2025-12-25 02:41:12'),(6,'Bọt rửa tay hương bạc hà 450ml - An toàn trên da','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN\r\n\r\nSản phẩm của EBC Việt Nam – Ứng dụng công nghệ sinh học từ Hoa Kỳ (Gemtek)\r\n\r\n\r\n\r\n? MÔ TẢ SẢN PHẨM\r\n\r\nBọt rửa tay sinh học Mr.KIT ứng dụng enzyme sinh học và chiết xuất thực vật tự nhiên giúp làm sạch hiệu quả mà vẫn dịu nhẹ với da tay.\r\n\r\nSản phẩm có độ pH trung tính, khoảng 9,3, giúp làm sạch tự nhiên mà không gây khô hay kích ứng, phù hợp với mọi loại da, kể cả da nhạy cảm.\r\n\r\nCông thức thân thiện môi trường, dễ phân huỷ sinh học, phù hợp cho cả gia đình và không gian sống xanh.\r\n\r\n\r\n\r\n? THÀNH PHẦN NỔI BẬT\r\n\r\nChiết xuất từ phụ phẩm thực vật: Đậu nành, ngô, hạt cọ, lạc, hạt óc chó, cây rum, hạt hướng dương, hạt cải dầu.\r\n\r\nCồn béo & Axit béo thực vật: Giúp làm sạch và làm mềm da, hạn chế khô ráp.\r\n\r\nEnzyme sinh học từ thực vật: Tăng khả năng loại bỏ cặn bẩn hữu cơ, dầu mỡ.\r\n\r\nEste & Sáp thực vật, hương hoa cam: Giúp khử mùi nhẹ nhàng, lưu lại hương thơm dễ chịu.\r\n\r\n\r\n\r\n? Không chứa: dầu mỏ, clo, amoniac, silicon, paraben, chất tẩy rửa tổng hợp hay hóa chất ăn mòn.\r\n\r\n\r\n\r\n? CÔNG DỤNG\r\n\r\nLàm sạch cặn bẩn hữu cơ, dầu mỡ, mùi khó chịu trên tay.\r\n\r\nDưỡng ẩm, giúp da tay mềm mịn sau khi rửa.\r\n\r\nPhù hợp cho mọi đối tượng: người lớn, trẻ nhỏ, nhân viên văn phòng, nhà bếp,…\r\n\r\n\r\n\r\n✨ HƯỚNG DẪN SỬ DỤNG\r\n\r\nLàm ướt tay bằng nước.\r\n\r\nLấy lượng bọt vừa đủ, xoa đều trong 20–30 giây.\r\n\r\nRửa lại bằng nước sạch và lau khô.\r\n\r\n\r\n\r\nMr.KIT – Bọt rửa tay sinh học, SẠCH SÂU _ LÀNH TÍNH.',95000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766630316/wlewvtudjxjzelyb0zue.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766630316/alcxkhsfefjbael21j4o.jpg\"]','2025-12-18 14:53:20','2025-12-25 02:38:37'),(7,'Bọt rửa tay hương hoa cam 450ml - An toàn trên da','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN\r\n\r\nSản phẩm của EBC Việt Nam – Ứng dụng công nghệ sinh học từ Hoa Kỳ (Gemtek)\r\n\r\n\r\n\r\n? MÔ TẢ SẢN PHẨM\r\n\r\nBọt rửa tay sinh học Mr.KIT ứng dụng enzyme sinh học và chiết xuất thực vật tự nhiên giúp làm sạch hiệu quả mà vẫn dịu nhẹ với da tay.\r\n\r\nSản phẩm có độ pH trung tính, khoảng 9,3, giúp làm sạch tự nhiên mà không gây khô hay kích ứng, phù hợp với mọi loại da, kể cả da nhạy cảm.\r\n\r\nCông thức thân thiện môi trường, dễ phân huỷ sinh học, phù hợp cho cả gia đình và không gian sống xanh.\r\n\r\n\r\n\r\n? THÀNH PHẦN NỔI BẬT\r\n\r\nChiết xuất từ phụ phẩm thực vật: Đậu nành, ngô, hạt cọ, lạc, hạt óc chó, cây rum, hạt hướng dương, hạt cải dầu.\r\n\r\nCồn béo & Axit béo thực vật: Giúp làm sạch và làm mềm da, hạn chế khô ráp.\r\n\r\nEnzyme sinh học từ thực vật: Tăng khả năng loại bỏ cặn bẩn hữu cơ, dầu mỡ.\r\n\r\nEste & Sáp thực vật, hương hoa cam: Giúp khử mùi nhẹ nhàng, lưu lại hương thơm dễ chịu.\r\n\r\n\r\n\r\n? Không chứa: dầu mỏ, clo, amoniac, silicon, paraben, chất tẩy rửa tổng hợp hay hóa chất ăn mòn.\r\n\r\n\r\n\r\n? CÔNG DỤNG\r\n\r\nLàm sạch cặn bẩn hữu cơ, dầu mỡ, mùi khó chịu trên tay.\r\n\r\nDưỡng ẩm, giúp da tay mềm mịn sau khi rửa.\r\n\r\nPhù hợp cho mọi đối tượng: người lớn, trẻ nhỏ, nhân viên văn phòng, nhà bếp,…\r\n\r\n\r\n\r\n✨ HƯỚNG DẪN SỬ DỤNG\r\n\r\nLàm ướt tay bằng nước.\r\n\r\nLấy lượng bọt vừa đủ, xoa đều trong 20–30 giây.\r\n\r\nRửa lại bằng nước sạch và lau khô.\r\n\r\n\r\n\r\nMr.KIT – Bọt rửa tay sinh học, SẠCH SÂU _ LÀNH TÍNH.',95000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766627975/dpoc8rng11w7clwk9ori.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766627979/pacmcjjpulqtpyo4gkgj.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766627983/xyl2nuu5ppyd2pbdjicp.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766627988/goeikqg3gzqg6jlpq0no.jpg\",\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766627991/luwpfvxudqgtsbdq7lkq.jpg\"]','2025-12-18 14:58:12','2025-12-25 03:38:45'),(15,'Xịt tẩy rửa bếp sinh học 500ml','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN\r\n\r\n Sản phẩm của EBC Việt Nam – Ứng dụng công nghệ sinh học từ Hoa Kỳ (Gemtek)\r\n \r\n \r\n \r\n ? MÔ TẢ SẢN PHẨM\r\n \r\n Bọt rửa tay sinh học Mr.KIT ứng dụng enzyme sinh học và chiết xuất thực vật tự nhiên giúp làm sạch hiệu quả mà vẫn dịu nhẹ với da tay.\r\n \r\n Sản phẩm có độ pH trung tính, khoảng 9,3, giúp làm sạch tự nhiên mà không gây khô hay kích ứng, phù hợp với mọi loại da, kể cả da nhạy cảm.\r\n \r\n Công thức thân thiện môi trường, dễ phân huỷ sinh học, phù hợp cho cả gia đình và không gian sống xanh.\r\n \r\n \r\n \r\n ? THÀNH PHẦN NỔI BẬT\r\n \r\n Chiết xuất từ phụ phẩm thực vật: Đậu nành, ngô, hạt cọ, lạc, hạt óc chó, cây rum, hạt hướng dương, hạt cải dầu.\r\n \r\n Cồn béo & Axit béo thực vật: Giúp làm sạch và làm mềm da, hạn chế khô ráp.\r\n \r\n Enzyme sinh học từ thực vật: Tăng khả năng loại bỏ cặn bẩn hữu cơ, dầu mỡ.\r\n \r\n Este & Sáp thực vật, hương hoa cam: Giúp khử mùi nhẹ nhàng, lưu lại hương thơm dễ chịu.\r\n \r\n \r\n \r\n ? Không chứa: dầu mỏ, clo, amoniac, silicon, paraben, chất tẩy rửa tổng hợp hay hóa chất ăn mòn.\r\n \r\n \r\n \r\n ? CÔNG DỤNG\r\n \r\n Làm sạch cặn bẩn hữu cơ, dầu mỡ, mùi khó chịu trên tay.\r\n \r\n Dưỡng ẩm, giúp da tay mềm mịn sau khi rửa.\r\n \r\n Phù hợp cho mọi đối tượng: người lớn, trẻ nhỏ, nhân viên văn phòng, nhà bếp,…\r\n \r\n \r\n \r\n ✨ HƯỚNG DẪN SỬ DỤNG\r\n \r\n Làm ướt tay bằng nước.\r\n \r\n Lấy lượng bọt vừa đủ, xoa đều trong 20–30 giây.\r\n \r\n Rửa lại bằng nước sạch và lau khô.\r\n \r\n \r\n \r\n Mr.KIT – Bọt rửa tay sinh học, SẠCH SÂU _ LÀNH TÍNH.',56000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766630063/zgmik1pjsgaiwzbttwi9.jpg\"]','2025-12-25 02:34:24','2025-12-25 10:44:01'),(16,'Xịt tẩy rửa kính sinh học 500ml','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN',55000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634197/wqc2qiufsegf0jni8jqy.jpg\"]','2025-12-25 03:43:17','2025-12-25 10:44:01'),(17,'Xịt tẩy rửa đồ da sinh học 500ml','Nước khử ion, Tetrasodium, Iminodisuccinate, dung môi cồn béo, TOFA, Alkanolamine, chất hoạt động bề mặt không ion, E211, tinh dầu tự nhiên','BỌT RỬA TAY SINH HỌC MR.KIT – SẢN PHẨM THUẦN CHAY TỪ THIÊN NHIÊN\r\n \r\n  Sản phẩm của EBC Việt Nam – Ứng dụng công nghệ sinh học từ Hoa Kỳ (Gemtek)\r\n  \r\n  \r\n  \r\n  ? MÔ TẢ SẢN PHẨM\r\n  \r\n  Bọt rửa tay sinh học Mr.KIT ứng dụng enzyme sinh học và chiết xuất thực vật tự nhiên giúp làm sạch hiệu quả mà vẫn dịu nhẹ với da tay.\r\n  \r\n  Sản phẩm có độ pH trung tính, khoảng 9,3, giúp làm sạch tự nhiên mà không gây khô hay kích ứng, phù hợp với mọi loại da, kể cả da nhạy cảm.\r\n  \r\n  Công thức thân thiện môi trường, dễ phân huỷ sinh học, phù hợp cho cả gia đình và không gian sống xanh.\r\n  \r\n  \r\n  \r\n  ? THÀNH PHẦN NỔI BẬT\r\n  \r\n  Chiết xuất từ phụ phẩm thực vật: Đậu nành, ngô, hạt cọ, lạc, hạt óc chó, cây rum, hạt hướng dương, hạt cải dầu.\r\n  \r\n  Cồn béo & Axit béo thực vật: Giúp làm sạch và làm mềm da, hạn chế khô ráp.\r\n  \r\n  Enzyme sinh học từ thực vật: Tăng khả năng loại bỏ cặn bẩn hữu cơ, dầu mỡ.\r\n  \r\n  Este & Sáp thực vật, hương hoa cam: Giúp khử mùi nhẹ nhàng, lưu lại hương thơm dễ chịu.\r\n  \r\n  \r\n  \r\n  ? Không chứa: dầu mỏ, clo, amoniac, silicon, paraben, chất tẩy rửa tổng hợp hay hóa chất ăn mòn.\r\n  \r\n  \r\n  \r\n  ? CÔNG DỤNG\r\n  \r\n  Làm sạch cặn bẩn hữu cơ, dầu mỡ, mùi khó chịu trên tay.\r\n  \r\n  Dưỡng ẩm, giúp da tay mềm mịn sau khi rửa.\r\n  \r\n  Phù hợp cho mọi đối tượng: người lớn, trẻ nhỏ, nhân viên văn phòng, nhà bếp,…\r\n  \r\n  \r\n  \r\n  ✨ HƯỚNG DẪN SỬ DỤNG\r\n  \r\n  Làm ướt tay bằng nước.\r\n  \r\n  Lấy lượng bọt vừa đủ, xoa đều trong 20–30 giây.\r\n  \r\n  Rửa lại bằng nước sạch và lau khô.\r\n  \r\n  \r\n  \r\n  Mr.KIT – Bọt rửa tay sinh học, SẠCH SÂU _ LÀNH TÍNH.',56000.00,NULL,'not_sale','Mr. Kit Pro','[\"https://res.cloudinary.com/dimrzqqk3/image/upload/v1766634298/vl6paixigkrezojszj7x.jpg\"]','2025-12-25 03:44:58','2025-12-25 03:52:57');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spotlight_products`
--

DROP TABLE IF EXISTS `spotlight_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spotlight_products` (
  `idsp1` int NOT NULL COMMENT 'ID sản phẩm spotlight 1',
  `idsp2` int NOT NULL COMMENT 'ID sản phẩm spotlight 2',
  `idsp3` int NOT NULL COMMENT 'ID sản phẩm spotlight 3',
  `idsp4` int NOT NULL COMMENT 'ID sản phẩm spotlight 4',
  `idsp5` int NOT NULL COMMENT 'ID sản phẩm spotlight 5',
  `idsp6` int NOT NULL COMMENT 'ID sản phẩm spotlight 6',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spotlight_products`
--

LOCK TABLES `spotlight_products` WRITE;
/*!40000 ALTER TABLE `spotlight_products` DISABLE KEYS */;
INSERT INTO `spotlight_products` VALUES (1,4,5,3,7,6,1);
/*!40000 ALTER TABLE `spotlight_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-25 12:39:49
