const mysql = require('mysql2/promise');

async function updateEnum() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elocation_db'
  });

  try {
    // Modifier l'enum pour ajouter les nouveaux types
    await connection.execute(`
      ALTER TABLE notifications 
      MODIFY COLUMN type ENUM(
        'booking_request',
        'booking_confirmed', 
        'booking_cancelled',
        'booking_expired',
        'booking_reminder',
        'new_message',
        'new_ad_match',
        'ad_approved',
        'ad_rejected',
        'price_change',
        'verification_approved',
        'verification_rejected'
      )
    `);
    
    console.log('Enum de notification mis à jour avec succès');
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

updateEnum();