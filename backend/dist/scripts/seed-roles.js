"use strict";
const mysql = require('mysql2/promise');
async function seedRoles() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'elocation_db',
    });
    console.log('🏗️ Création des rôles...');
    const roles = [
        { name: 'admin', description: 'Administrateur du système' },
        { name: 'user', description: 'Utilisateur standard' },
    ];
    for (const role of roles) {
        const [existing] = await connection.execute('SELECT id FROM roles WHERE name = ?', [role.name]);
        if (existing.length > 0) {
            console.log(`⚠ Rôle ${role.name} existe déjà, ignoré`);
            continue;
        }
        const id = require('crypto').randomUUID();
        await connection.execute('INSERT INTO roles (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [id, role.name, role.description]);
        console.log(`✓ Créé: ${role.name}`);
    }
    console.log(`\n🎉 ${roles.length} rôles créés avec succès !`);
    await connection.end();
}
seedRoles().catch(console.error);
//# sourceMappingURL=seed-roles.js.map