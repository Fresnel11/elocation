-- Script de nettoyage de la base de données
USE elocation_db;

-- Désactiver temporairement les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer les entrées vides dans categories
DELETE FROM categories WHERE name = '' OR name IS NULL OR TRIM(name) = '';

-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- Vérifier qu'il n'y a plus d'entrées vides
SELECT COUNT(*) as empty_entries FROM categories WHERE name = '' OR name IS NULL OR TRIM(name) = '';

-- Afficher les catégories restantes
SELECT id, name FROM categories;