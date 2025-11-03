# Files WebSocket à supprimer

Supprimez ces fichiers pour ne garder que le WebSocket principal dans main.ts :

## Fichier principal à supprimer :
- `src/notifications/notifications.gateway.ts`

## Modifications à faire dans :
- `src/notifications/notifications.module.ts` - Supprimer NotificationsGateway des imports/providers/exports

## Commandes à exécuter :
```bash
# Supprimer le fichier gateway
rm src/notifications/notifications.gateway.ts

# Ou sur Windows
del src\notifications\notifications.gateway.ts
```

Le WebSocket principal dans main.ts (port 3001) sera le seul service WebSocket actif.