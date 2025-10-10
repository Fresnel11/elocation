const fs = require('fs');
const path = require('path');

console.log('🔄 Désactivation de la synchronisation...');

try {
  const appModulePath = path.join(__dirname, 'src', 'app.module.ts');
  let content = fs.readFileSync(appModulePath, 'utf8');
  
  // Désactiver synchronize
  content = content.replace('synchronize: true,', 'synchronize: false,');
  fs.writeFileSync(appModulePath, content);
  
  console.log('✅ Synchronisation désactivée avec succès');
  console.log('🔄 Redémarrez l\'application pour appliquer les changements');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}