-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 10, 2013 at 06:13 AM
-- Server version: 5.1.66
-- PHP Version: 5.3.15

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `runcoco`
--

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` text,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_settings_on_name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `name`, `value`, `updated_at`) VALUES
(1, 'gmap_api_key', '--- AIzdSyASOUuCZOrUv31afTLg72EqBY2n-o4VmCI\n...\n', '2012-02-23 15:36:25'),
(2, 'registration_required', '--- ''1''\n', '2013-03-14 11:47:33'),
(3, 'uploadify', '--- ''1''\n', '2013-03-14 11:47:33'),
(4, 'publish_contributions', '--- ''1''\n', '2013-03-14 11:47:33'),
(5, 'relative_url_root', '--- ''''\n', '2011-03-01 18:47:15'),
(6, 'ui_locales', '---\n- en\n- da\n- de\n- el\n- fr\n- it\n- nl\n- sl\n', '2013-03-14 11:47:33'),
(7, 'contribution_approval_required', '--- ''1''\n', '2013-03-14 11:47:33'),
(8, 'max_upload_size', '--- ''80214400''\n', '2013-03-14 11:47:33'),
(9, 'allowed_upload_extensions', '--- doc,docx,pdf,txt,jpg,jpeg,jp2,jpx,gif,png,tiff,mp3,ogg,ogv,webm,mp4,avi,mpg,zip,mp3\n...\n', '2012-04-04 06:04:57'),
(10, 'site_name', '--- Europeana 1914-1918\n...\n', '2011-10-04 09:08:33'),
(11, 'google_analytics_key', '--- ''''\n', '2013-03-14 11:47:33'),
(12, 'bing_translate_key', '--- ''''\n', '2013-03-14 11:47:33'),
(13, 'bing_client_id', '--- ''''\n', '2013-03-14 11:47:33'),
(14, 'bing_client_secret', '--- ''''\n', '2013-03-14 11:47:33'),
(15, 'sharethis_id', '--- ''''\n', '2013-03-14 11:47:33'),
(16, 'banner_active', '--- ''0''\n', '2013-03-14 11:47:33'),
(17, 'banner_text', '--- ''''\n', '2013-01-11 12:15:02');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
