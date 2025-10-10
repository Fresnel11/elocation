const mysql = require('mysql2/promise');

async function updateColumns() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elocation_db'
  });

  try {
    // Modifier les colonnes pour supporter les images base64
    await connection.execute(`
      ALTER TABLE user_verifications 
      MODIFY COLUMN selfiePhoto LONGTEXT
    `);
    
    await connection.execute(`
      ALTER TABLE user_verifications 
      MODIFY COLUMN documentFrontPhoto LONGTEXT
    `);
    
    await connection.execute(`
      ALTER TABLE user_verifications 
      MODIFY COLUMN documentBackPhoto LONGTEXT
    `);
    
    console.log('Colonnes mises à jour avec succès');
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

updateColumns();