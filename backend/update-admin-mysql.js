const mysql = require('mysql2/promise');

async function updateAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elocation_db'
  });

  try {
    // Ajouter la colonne isVerified si elle n'existe pas
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN isVerified BOOLEAN DEFAULT FALSE
      `);
      console.log('Column isVerified added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Column isVerified already exists');
      } else {
        throw error;
      }
    }
    
    // Mettre à jour le super admin
    const [result] = await connection.execute(`
      UPDATE users 
      SET isVerified = true 
      WHERE email = 'fresnel@superadmin.com'
    `);
    
    console.log('Super admin updated successfully');
    console.log('Rows affected:', result.affectedRows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

updateAdmin();