"use strict";
const mysql = require('mysql2/promise');
async function seedSubCategories() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'elocation_db',
    });
    console.log('🏗️ Création des sous-catégories...');
    const [categories] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    for (const cat of categories) {
        categoryMap[cat.name] = cat.id;
    }
    const subCategories = [
        { name: 'Appartement', description: 'Appartements meublés ou non', categoryName: 'Immobilier' },
        { name: 'Maison', description: 'Maisons individuelles', categoryName: 'Immobilier' },
        { name: 'Studio', description: 'Studios et petits espaces', categoryName: 'Immobilier' },
        { name: 'Villa', description: 'Villas avec jardin', categoryName: 'Immobilier' },
        { name: 'Chambre', description: 'Chambres en colocation', categoryName: 'Immobilier' },
        { name: 'Bureau', description: 'Espaces de bureau', categoryName: 'Immobilier' },
        { name: 'Voiture', description: 'Voitures de location', categoryName: 'Véhicules' },
        { name: 'Moto', description: 'Motos et scooters', categoryName: 'Véhicules' },
        { name: 'Camion', description: 'Camions et utilitaires', categoryName: 'Véhicules' },
        { name: 'Vélo', description: 'Vélos et trottinettes', categoryName: 'Véhicules' },
        { name: 'Réfrigérateur', description: 'Réfrigérateurs et congélateurs', categoryName: 'Électroménager' },
        { name: 'Lave-linge', description: 'Machines à laver', categoryName: 'Électroménager' },
        { name: 'Climatiseur', description: 'Climatiseurs et ventilateurs', categoryName: 'Électroménager' },
        { name: 'Télévision', description: 'Téléviseurs et écrans', categoryName: 'Électroménager' },
        { name: 'Micro-onde', description: 'Fours micro-ondes', categoryName: 'Électroménager' },
        { name: 'Sonorisation', description: 'Matériel audio', categoryName: 'Événementiel' },
        { name: 'Éclairage', description: 'Éclairage pour événements', categoryName: 'Événementiel' },
        { name: 'Mobilier', description: 'Tables, chaises, décoration', categoryName: 'Événementiel' },
        { name: 'Tente', description: 'Tentes et barnums', categoryName: 'Événementiel' },
        { name: 'Ordinateur', description: 'Ordinateurs et laptops', categoryName: 'Autres' },
        { name: 'Outillage', description: 'Outils professionnels', categoryName: 'Autres' },
        { name: 'Sport', description: 'Équipements sportifs', categoryName: 'Autres' },
        { name: 'Jeux', description: 'Jeux et divertissements', categoryName: 'Autres' },
    ];
    for (const subCat of subCategories) {
        const categoryId = categoryMap[subCat.categoryName];
        if (categoryId) {
            const [existing] = await connection.execute('SELECT id FROM subcategories WHERE name = ? AND categoryId = ?', [subCat.name, categoryId]);
            if (existing.length > 0) {
                console.log(`⚠ Sous-catégorie ${subCat.name} existe déjà, ignorée`);
                continue;
            }
            const id = require('crypto').randomUUID();
            await connection.execute('INSERT INTO subcategories (id, name, description, categoryId, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', [id, subCat.name, subCat.description, categoryId, true]);
            console.log(`✓ Créé: ${subCat.name} (${subCat.categoryName})`);
        }
    }
    console.log(`\n🎉 ${subCategories.length} sous-catégories créées avec succès !`);
    await connection.end();
}
seedSubCategories().catch(console.error);
//# sourceMappingURL=seed-subcategories.js.map