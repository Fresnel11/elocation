const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'elocation_db',
  user: 'postgres',
  password: 'password'
});

async function updateAdmin() {
  try {
    await client.connect();
    
    // Ajouter la colonne isVerified si elle n'existe pas
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT FALSE
    `);
    
    // Mettre à jour le super admin
    const result = await client.query(`
      UPDATE users 
      SET "isVerified" = true 
      WHERE email = 'fresnel@superadmin.com'
    `);
    
    console.log('Super admin updated successfully');
    console.log('Rows affected:', result.rowCount);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

updateAdmin();