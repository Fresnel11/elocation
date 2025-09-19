"use strict";
const mysql = require('mysql2/promise');
async function fixRolesTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'elocation_db',
    });
    console.log('🔧 Vérification et correction de la table roles...');
    const [columns] = await connection.execute('DESCRIBE roles');
    console.log('Structure actuelle:', columns);
    await connection.execute('DELETE FROM roles');
    console.log('✓ Anciens rôles supprimés');
    try {
        await connection.execute("ALTER TABLE roles MODIFY COLUMN name ENUM('admin', 'user') NOT NULL");
        console.log('✓ Colonne name mise à jour');
    }
    catch (error) {
        console.log('⚠ Erreur lors de la modification:', error.message);
    }
    const roles = [
        { name: 'admin', description: 'Administrateur du système' },
        { name: 'user', description: 'Utilisateur standard' },
    ];
    for (const role of roles) {
        const id = require('crypto').randomUUID();
        await connection.execute('INSERT INTO roles (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [id, role.name, role.description]);
        console.log(`✓ Créé: ${role.name}`);
    }
    console.log('\n🎉 Table roles corrigée et rôles créés avec succès !');
    await connection.end();
}
fixRolesTable().catch(console.error);
//# sourceMappingURL=fix-roles-table.js.map