-- MySQL dump 10.13  Distrib 5.7.12, for osx10.9 (x86_64)
--
-- Host: localhost    Database: expo
-- ------------------------------------------------------
-- Server version	5.7.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `stand_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_event_id_index` (`event_id`),
  KEY `reservation_stand_id_index` (`stand_id`),
  KEY `reservation_user_id_index` (`user_id`),
  CONSTRAINT `reservation_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `reservation_stand_id_foreign` FOREIGN KEY (`stand_id`) REFERENCES `stands` (`id`),
  CONSTRAINT `reservation_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `image_type` tinyint(4) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `events_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2016-08-29 07:41:22','2016-08-29 07:41:22','xpzJsw',0,'Planet Planet','55 Music Concourse Dr, San Francisco, CA 94118','2016-09-01 09:00:00','2016-09-25 19:00:00','Reinvent your Thursday nights at <strong>After Dark</strong>. Experience a fascinating array of unique, adult-only programs and events that change each week. Grab dinner by the Bay, play with hundreds of hands-on exhibits, crawl through our pitch-black Tactile Dome, sip cocktails, and explore.'),(2,'2016-08-29 07:41:22','2016-08-29 07:41:22','Jhsu8s',0,'Vegas Now','3570 S Las Vegas Blvd, Las Vegas, NV 89109','2016-09-02 18:00:00','2016-09-30 23:00:00','There’s always something exciting happening at Fremont Street Experience, from the Viva Vision light show to world-class concerts. Remember, our concerts, live entertainment and Viva Vision shows are all free. That’s not a typo. :-)'),(3,'2016-08-29 07:41:22','2016-08-29 07:41:22','gTYjsw',0,'Go Brazil','Av. Olof Palme, 305 - Camorim, Rio de Janeiro - RJ, 22783-119','2016-09-03 08:00:00','2016-09-05 23:00:00','<strong>Get ready</strong> for the intense excitement of 42 Olympic sport disciplines in one place: <mark>306 events</mark> over the course of 19 days of competition will yield 136 medals for women, 161 for men and nine mixed medals.');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stands`
--

DROP TABLE IF EXISTS `stands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stands` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `code` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `sq_meters` decimal(7,3) NOT NULL,
  `image_ext` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `logo_pos` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_sent` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_event_code` (`event_id`,`code`),
  KEY `stands_event_id_index` (`event_id`),
  CONSTRAINT `stands_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stands`
--

LOCK TABLES `stands` WRITE;
/*!40000 ALTER TABLE `stands` DISABLE KEYS */;
INSERT INTO `stands` VALUES (1,'2016-08-29 07:41:23','2016-08-29 07:41:23',1,0,'N1',1250.00,30.000,'jpg','Small, but amazing',NULL,0),(2,'2016-08-29 07:41:23','2016-08-29 07:41:23',1,0,'S1',1600.00,40.000,'jpg','King of the Hill',NULL,0),(3,'2016-08-29 07:41:23','2016-08-29 07:41:23',1,0,'E1',500.00,20.000,'jpg','Your startup going BIG',NULL,0),(4,'2016-08-29 07:41:23','2016-08-29 07:41:23',1,0,'W1',2000.00,80.000,'jpg','King of the World',NULL,0),(5,'2016-08-29 07:41:23','2016-08-29 07:41:23',2,0,'N1',990.00,15.000,'jpg','Best spot',NULL,0),(6,'2016-08-29 07:41:23','2016-08-29 07:41:23',2,0,'S1',880.00,15.000,'jpg','Great views',NULL,0),(7,'2016-08-29 07:41:23','2016-08-29 07:41:23',2,0,'E1',770.00,10.000,'jpg','Next of the entrance',NULL,0),(8,'2016-08-29 07:41:23','2016-08-29 07:41:23',2,0,'W1',650.00,10.000,'jpg','Close to the tree',NULL,0),(9,'2016-08-29 07:41:23','2016-08-29 07:41:23',3,0,'Olympic1',20000.00,1500.000,'jpg','Great Green from all','l',0),(10,'2016-08-29 07:41:23','2016-08-29 07:41:23',3,0,'Olympic2',1200.00,150.000,'jpg','Favela view','r',0),(11,'2016-08-29 07:41:23','2016-08-29 07:41:23',3,0,'Olympic3',5000.00,500.000,'jpg','Cristo at the Top','t',0),(12,'2016-08-29 07:41:23','2016-08-29 07:41:23',3,0,'Olympic4',2000.00,300.000,'jpg','Beach view','l',0);
/*!40000 ALTER TABLE `stands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2016_08_20_000000_create_users_table',1),('2016_08_20_100000_create_password-resets_table',1),('2016_08_20_210129_create_events_table',1),('2016_08_20_213407_create_stands_table',1),('2016_08_20_215623_create_reservations_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `user_id` int(10) unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_user_id_index` (`user_id`),
  KEY `password_resets_token_index` (`token`),
  CONSTRAINT `password_resets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `company` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_sname` varchar(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dir_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `logo_ext` varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_dir_name_unique` (`dir_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-29  4:43:01
