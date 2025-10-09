-- Supprimer complètement la base de données et la recréer
DROP DATABASE IF EXISTS elocation_db;
CREATE DATABASE elocation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la nouvelle base
USE elocation_db;

-- Vérifier qu'elle est vide
SELECT 'Base de données créée et vide' as status;