-- MySQL dump 10.13  Distrib 5.5.62, for Linux (x86_64)
--
-- Host: localhost    Database: europeana_1418
-- ------------------------------------------------------
-- Server version	5.5.62

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
-- Table structure for table `annotation_shapes`
--

DROP TABLE IF EXISTS `annotation_shapes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `annotation_shapes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `annotation_id` int(11) DEFAULT NULL,
  `shape_type` varchar(255) DEFAULT NULL,
  `units` varchar(255) DEFAULT 'relative',
  `geometry` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_annotation_shapes_on_annotation_id` (`annotation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `annotations`
--

DROP TABLE IF EXISTS `annotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `annotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `annotatable_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `text` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `src` varchar(255) DEFAULT NULL,
  `annotatable_type` text,
  PRIMARY KEY (`id`),
  KEY `index_annotations_on_attachment_id` (`annotatable_id`),
  KEY `index_annotations_on_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contribution_id` int(11) DEFAULT NULL,
  `file_file_name` varchar(255) DEFAULT NULL,
  `file_content_type` varchar(255) DEFAULT NULL,
  `file_file_size` int(11) DEFAULT NULL,
  `file_updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `metadata_record_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `public` tinyint(1) DEFAULT NULL,
  `file_meta` text,
  PRIMARY KEY (`id`),
  KEY `index_attachments_on_metadata_record_id` (`metadata_record_id`),
  KEY `index_attachments_on_contribution_id` (`contribution_id`)
) ENGINE=InnoDB AUTO_INCREMENT=259021 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collection_days`
--

DROP TABLE IF EXISTS `collection_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taxonomy_term_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `contact_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image_file_name` varchar(255) DEFAULT NULL,
  `image_content_type` varchar(255) DEFAULT NULL,
  `image_file_size` int(11) DEFAULT NULL,
  `image_updated_at` datetime DEFAULT NULL,
  `map_latlng` varchar(255) DEFAULT NULL,
  `map_zoom` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_collection_days_on_taxonomy_term_id` (`taxonomy_term_id`),
  KEY `index_collection_days_on_contact_id` (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `street_address` text,
  `locality` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `age` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17578 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contributions`
--

DROP TABLE IF EXISTS `contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contributions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `contributor_id` int(11) DEFAULT NULL,
  `metadata_record_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `delta` tinyint(1) NOT NULL DEFAULT '1',
  `catalogued_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_contributions_on_contributor_id` (`contributor_id`),
  KEY `index_contributions_on_metadata_record_id` (`metadata_record_id`),
  KEY `index_contributions_on_guest_id` (`guest_id`),
  KEY `index_contributions_on_catalogued_by` (`catalogued_by`)
) ENGINE=InnoDB AUTO_INCREMENT=21817 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `current_statuses`
--

DROP TABLE IF EXISTS `current_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `current_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `record_id` int(11) DEFAULT NULL,
  `record_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_current_statuses_on_record_id` (`record_id`),
  KEY `index_current_statuses_on_record_type` (`record_type`),
  KEY `index_current_statuses_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=24070 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delayed_jobs`
--

DROP TABLE IF EXISTS `delayed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delayed_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priority` int(11) NOT NULL DEFAULT '0',
  `attempts` int(11) NOT NULL DEFAULT '0',
  `handler` text NOT NULL,
  `last_error` text,
  `run_at` datetime DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `failed_at` datetime DEFAULT NULL,
  `locked_by` varchar(255) DEFAULT NULL,
  `queue` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `delayed_jobs_priority` (`priority`,`run_at`)
) ENGINE=InnoDB AUTO_INCREMENT=199449 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `europeana_records`
--

DROP TABLE IF EXISTS `europeana_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `europeana_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `record_id` varchar(255) DEFAULT NULL,
  `object` mediumtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_europeana_records_on_record_id` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1022408 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exports`
--

DROP TABLE IF EXISTS `exports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `file_file_name` varchar(255) DEFAULT NULL,
  `file_content_type` varchar(255) DEFAULT NULL,
  `file_file_size` int(11) DEFAULT NULL,
  `file_updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `format` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_exports_on_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institutions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_institutions_on_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log_type` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `message` text,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=586346 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metadata_fields`
--

DROP TABLE IF EXISTS `metadata_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `field_type` varchar(255) DEFAULT NULL,
  `required` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `position` int(11) DEFAULT '0',
  `cataloguing` tinyint(1) DEFAULT '0',
  `searchable` tinyint(1) DEFAULT '0',
  `hint` text,
  `multi` tinyint(1) DEFAULT NULL,
  `show_in_listing` tinyint(1) DEFAULT '0',
  `contribution` tinyint(1) NOT NULL DEFAULT '1',
  `attachment` tinyint(1) NOT NULL DEFAULT '1',
  `facet` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metadata_mappings`
--

DROP TABLE IF EXISTS `metadata_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata_mappings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mappable_id` int(11) DEFAULT NULL,
  `mappable_type` varchar(255) DEFAULT NULL,
  `format` varchar(255) DEFAULT NULL,
  `content` mediumtext,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_metadata_mappings_on_mappable_id_and_mappable_type` (`mappable_id`,`mappable_type`)
) ENGINE=InnoDB AUTO_INCREMENT=33121 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metadata_records`
--

DROP TABLE IF EXISTS `metadata_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `field_alternative` varchar(255) DEFAULT NULL,
  `field_creator` varchar(255) DEFAULT NULL,
  `field_subject` varchar(255) DEFAULT NULL,
  `field_date` varchar(255) DEFAULT NULL,
  `field_description` text,
  `field_date_from` varchar(10) DEFAULT NULL,
  `field_date_to` varchar(10) DEFAULT NULL,
  `field_location_map` varchar(255) DEFAULT NULL,
  `field_location_placename` varchar(255) DEFAULT NULL,
  `field_contributor_behalf` varchar(255) DEFAULT NULL,
  `field_page_number` varchar(255) DEFAULT NULL,
  `field_page_total` varchar(255) DEFAULT NULL,
  `field_notes` text,
  `field_lang_other` varchar(255) DEFAULT NULL,
  `field_object_side` varchar(255) DEFAULT NULL,
  `field_cover_image` varchar(255) DEFAULT NULL,
  `field_creator_family_name` varchar(255) DEFAULT NULL,
  `field_creator_given_name` varchar(255) DEFAULT NULL,
  `field_character1_family_name` varchar(255) DEFAULT NULL,
  `field_character1_given_name` varchar(255) DEFAULT NULL,
  `field_character2_family_name` varchar(255) DEFAULT NULL,
  `field_character2_given_name` varchar(255) DEFAULT NULL,
  `field_attachment_description` text,
  `field_summary` text,
  `field_ticket` varchar(255) DEFAULT NULL,
  `field_location_zoom` varchar(255) DEFAULT NULL,
  `field_editor_pick_text` text,
  `field_editor_pick_sig` varchar(255) DEFAULT NULL,
  `field_character1_dob` varchar(10) DEFAULT NULL,
  `field_character1_dod` varchar(10) DEFAULT NULL,
  `field_character2_dob` varchar(10) DEFAULT NULL,
  `field_character2_dod` varchar(10) DEFAULT NULL,
  `field_character1_pob` varchar(255) DEFAULT NULL,
  `field_character1_pod` varchar(255) DEFAULT NULL,
  `field_character2_pob` varchar(255) DEFAULT NULL,
  `field_character2_pod` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280855 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metadata_records_taxonomy_terms`
--

DROP TABLE IF EXISTS `metadata_records_taxonomy_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata_records_taxonomy_terms` (
  `metadata_record_id` int(11) DEFAULT NULL,
  `taxonomy_term_id` int(11) DEFAULT NULL,
  UNIQUE KEY `index` (`metadata_record_id`,`taxonomy_term_id`),
  UNIQUE KEY `reverse_index` (`taxonomy_term_id`,`metadata_record_id`),
  KEY `index_metadata_records_taxonomy_terms_on_metadata_record_id` (`metadata_record_id`),
  KEY `index_metadata_records_taxonomy_terms_on_taxonomy_term_id` (`taxonomy_term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `record_statuses`
--

DROP TABLE IF EXISTS `record_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `record_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `record_id` int(11) DEFAULT NULL,
  `record_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_record_statuses_on_record_id_and_record_type` (`record_id`,`record_type`),
  KEY `index_record_statuses_on_user_id` (`user_id`),
  KEY `index_record_statuses_on_status` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=60944 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schema_migrations`
--

DROP TABLE IF EXISTS `schema_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_migrations` (
  `version` varchar(255) NOT NULL,
  UNIQUE KEY `unique_schema_migrations` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_suggestions`
--

DROP TABLE IF EXISTS `search_suggestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `stop_word` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `frequency` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_search_index_words_on_text` (`text`)
) ENGINE=InnoDB AUTO_INCREMENT=53727 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` text,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_settings_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taggings`
--

DROP TABLE IF EXISTS `taggings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taggings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) DEFAULT NULL,
  `taggable_id` int(11) DEFAULT NULL,
  `taggable_type` varchar(255) DEFAULT NULL,
  `tagger_id` int(11) DEFAULT NULL,
  `tagger_type` varchar(255) DEFAULT NULL,
  `context` varchar(128) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_taggings_on_tag_id` (`tag_id`),
  KEY `index_taggings_on_taggable_id_and_taggable_type_and_context` (`taggable_id`,`taggable_type`,`context`)
) ENGINE=InnoDB AUTO_INCREMENT=3724 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1608 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxonomy_terms`
--

DROP TABLE IF EXISTS `taxonomy_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taxonomy_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term` varchar(255) DEFAULT NULL,
  `metadata_field_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_taxonomy_terms_on_metadata_field_id` (`metadata_field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=502 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `encrypted_password` varchar(60) NOT NULL,
  `reset_password_token` varchar(20) DEFAULT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `terms` tinyint(1) DEFAULT NULL,
  `picture_file_name` varchar(255) DEFAULT NULL,
  `picture_content_type` varchar(255) DEFAULT NULL,
  `picture_file_size` int(11) DEFAULT NULL,
  `picture_updated_at` datetime DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `institution_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_username` (`username`),
  UNIQUE KEY `index_users_on_reset_password_token` (`reset_password_token`),
  KEY `index_users_on_email` (`email`),
  KEY `index_users_on_contact_id` (`contact_id`),
  KEY `index_users_on_institution_id` (`institution_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17541 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-11 13:07:28
