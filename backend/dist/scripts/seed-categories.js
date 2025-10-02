"use strict";
const mysql = require('mysql2/promise');
async function seedCategories() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'elocation_db',
    });
    console.log('🏗️ Création des catégories principales...');
    const categories = [
        { name: 'Immobilier', description: 'Maisons, appartements, terrains à louer' },
        { name: 'Véhicules', description: 'Voitures, motos, vélos à louer' },
        { name: 'Électroménager', description: 'Appareils électroménagers et électroniques' },
        { name: 'Événementiel', description: 'Matériel et services pour événements' },
        { name: 'Autres', description: 'Articles et services divers' },
    ];
    for (const cat of categories) {
        const [existing] = await connection.execute('SELECT id FROM categories WHERE name = ?', [cat.name]);
        if (existing.length > 0) {
            console.log(`⚠ Catégorie ${cat.name} existe déjà, ignorée`);
            continue;
        }
        const id = require('crypto').randomUUID();
        await connection.execute('INSERT INTO categories (id, name, description, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())', [id, cat.name, cat.description, true]);
        console.log(`✓ Créé: ${cat.name}`);
    }
    console.log(`\n🎉 ${categories.length} catégories créées avec succès !`);
    await connection.end();
}
seedCategories().catch(console.error);
//# sourceMappingURL=seed-categories.js.map