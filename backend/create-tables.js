const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Nettoyage de la base de données...');

try {
  // Exécuter le script SQL de nettoyage
  execSync('mysql -u root -p < reset-db.sql', { 
    cwd: __dirname,
    stdio: 'inherit' 
  });
  
  console.log('✅ Base de données nettoyée avec succès');
  
  // Maintenant activer temporairement la synchronisation
  console.log('🔄 Activation temporaire de la synchronisation...');
  
  const fs = require('fs');
  const appModulePath = path.join(__dirname, 'src', 'app.module.ts');
  let content = fs.readFileSync(appModulePath, 'utf8');
  
  // Activer synchronize temporairement
  content = content.replace('synchronize: false,', 'synchronize: true,');
  fs.writeFileSync(appModulePath, content);
  
  console.log('✅ Synchronisation activée. Redémarrez l\'application maintenant.');
  console.log('⚠️  Après le démarrage réussi, désactivez à nouveau la synchronisation.');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}