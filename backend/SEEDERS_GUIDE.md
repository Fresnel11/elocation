# Guide des Seeders - eLocation

## Problème résolu

**Problème identifié :** Les seeders s'exécutaient automatiquement à chaque démarrage de l'application, supprimant toutes les annonces réelles et les remplaçant par des annonces fictives.

**Solution :** Les seeders ne s'exécutent plus automatiquement. Ils doivent être déclenchés manuellement via des endpoints API.

## Nouveaux endpoints disponibles

### 1. Initialiser les données de base (RECOMMANDÉ)
```
POST http://localhost:3000/init/base-data
```
- Crée les rôles, permissions, catégories, sous-catégories et utilisateurs de base
- **NE SUPPRIME PAS** les annonces existantes
- **NE CRÉE PAS** d'annonces fictives
- Idéal pour un environnement de production

### 2. Initialiser toutes les données (DÉVELOPPEMENT UNIQUEMENT)
```
POST http://localhost:3000/init/all-data
```
- Exécute l'initialisation des données de base
- **PUIS** crée 20 annonces fictives
- **ATTENTION :** Supprime les annonces existantes
- À utiliser uniquement en développement

### 3. Créer uniquement des annonces de démonstration
```
POST http://localhost:3000/init/demo-ads
```
- Crée uniquement 20 annonces fictives
- **ATTENTION :** Supprime les annonces existantes
- Utile pour les démonstrations

### 4. Mettre à jour les coordonnées
```
POST http://localhost:3000/init/update-coordinates
```
- Met à jour les coordonnées géographiques des annonces existantes

## Utilisation recommandée

### Pour la première installation :
1. Démarrer l'application
2. Appeler `POST /init/base-data` pour créer les données essentielles
3. Commencer à utiliser l'application normalement

### Pour le développement avec données de test :
1. Démarrer l'application
2. Appeler `POST /init/all-data` pour avoir des données de test
3. Développer et tester

### Pour la production :
1. Démarrer l'application
2. Appeler `POST /init/base-data` UNE SEULE FOIS
3. Ne plus jamais appeler les autres endpoints

## Réponses des endpoints

Tous les endpoints retournent maintenant un format standardisé :

```json
{
  "success": true,
  "message": "Description du succès"
}
```

En cas d'erreur :
```json
{
  "success": false,
  "error": "Description de l'erreur",
  "details": "Détails techniques de l'erreur"
}
```

## Important

- ✅ Les annonces réelles ne seront plus supprimées au redémarrage
- ✅ Vous pouvez maintenant publier des annonces qui persistent
- ⚠️ Utilisez `/init/demo-ads` et `/init/all-data` avec précaution car ils suppriment les annonces existantes
- 🔧 Pour la production, utilisez uniquement `/init/base-data`