# Guide de résolution des problèmes - eLocation

## Problèmes identifiés et corrigés

### 1. Images des annonces ne s'affichent pas

**Problème :** Les images uploadées ne s'affichent pas dans les cartes d'annonces.

**Causes possibles :**
- URLs des images mal formées (relatives vs absolues)
- Fichiers non uploadés correctement
- Serveur statique mal configuré

**Solutions appliquées :**
- ✅ Correction de l'affichage des URLs d'images dans `AdCard.tsx`
- ✅ Ajout de fallback vers image par défaut en cas d'erreur
- ✅ Correction de la logique d'upload dans les formulaires

### 2. Liste des annonces vide malgré publication

**Problème :** "Aucune annonce trouvée" alors que des annonces ont été publiées.

**Causes possibles :**
- Filtres trop restrictifs (isActive ET isAvailable)
- Cache non invalidé
- Problème de requête SQL

**Solutions appliquées :**
- ✅ Correction des filtres dans `ads.service.ts`
- ✅ Ajout de logs pour débugger
- ✅ Endpoint de debug `/ads/debug/count`

### 3. Upload des fichiers défaillant

**Problème :** Les fichiers ne sont pas correctement uploadés lors de la création d'annonce.

**Solutions appliquées :**
- ✅ Correction de la logique d'upload dans `CreateAdModal.tsx`
- ✅ Correction de la logique d'upload dans `CreateAdPage.tsx`
- ✅ Séparation claire entre upload et création d'annonce

## Tests à effectuer

### 1. Vérifier les annonces en base
```bash
# Exécuter le script de debug
node debug-ads.js
```

### 2. Tester l'endpoint de debug
```bash
curl http://localhost:3000/ads/debug/count
```

### 3. Vérifier les uploads
1. Publier une nouvelle annonce avec image
2. Vérifier que le fichier apparaît dans `/backend/uploads/`
3. Vérifier que l'URL est correcte dans la base de données

### 4. Vérifier l'affichage
1. Aller sur `/ads`
2. Vérifier que les annonces s'affichent
3. Vérifier que les images se chargent

## Commandes utiles

### Redémarrer les services
```bash
# Backend
cd backend
npm run start:dev

# Frontend  
cd frontend
npm run dev
```

### Vérifier les logs
- Backend : Regarder la console pour les logs `[AdsService]`
- Frontend : Ouvrir les DevTools pour voir les erreurs réseau

### Réinitialiser les données (si nécessaire)
```bash
# Appeler l'endpoint de base data uniquement
curl -X POST http://localhost:3000/init/base-data
```

## Prochaines étapes

Si les problèmes persistent :

1. **Vérifier la base de données directement**
2. **Tester l'upload manuellement via Postman**
3. **Vérifier les permissions du dossier uploads**
4. **Contrôler la configuration du serveur statique**

## Notes importantes

- ⚠️ Ne plus utiliser `/init/all-data` en production
- ✅ Les seeders ne s'exécutent plus automatiquement
- 🔧 Utiliser les logs pour diagnostiquer les problèmes
- 📁 Vérifier que le dossier `uploads` existe et est accessible