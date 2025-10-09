-- Script pour nettoyer et recréer la base de données
DROP DATABASE IF EXISTS elocation_db;
CREATE DATABASE elocation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elocation_db;

-- Vérifier que la base est bien vide
SHOW TABLES;