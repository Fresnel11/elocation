// Script de debug pour vérifier les annonces
const mysql = require('mysql2/promise');

async function checkAds() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elocation_db'
  });

  try {
    // Vérifier le nombre total d'annonces
    const [totalRows] = await connection.execute('SELECT COUNT(*) as total FROM ads');
    console.log('Total annonces:', totalRows[0].total);

    // Vérifier les annonces actives
    const [activeRows] = await connection.execute('SELECT COUNT(*) as total FROM ads WHERE isActive = 1');
    console.log('Annonces actives:', activeRows[0].total);

    // Vérifier les dernières annonces créées
    const [recentAds] = await connection.execute(`
      SELECT id, title, photos, isActive, isAvailable, createdAt 
      FROM ads 
      ORDER BY createdAt DESC 
      LIMIT 5
    `);
    
    console.log('\nDernières annonces:');
    recentAds.forEach(ad => {
      console.log(`- ${ad.title} (${ad.id})`);
      console.log(`  Photos: ${ad.photos}`);
      console.log(`  Active: ${ad.isActive}, Disponible: ${ad.isAvailable}`);
      console.log(`  Créée: ${ad.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

checkAds();