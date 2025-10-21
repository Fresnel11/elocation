# 🚀 Intégration Moneroo - eLocation

## 📋 Vue d'ensemble

Le système de paiement Moneroo est intégré dans eLocation pour gérer les transactions entre locataires et propriétaires de manière sécurisée.

## 🔄 Flow de paiement complet

### 1. Demande de réservation
- Le locataire fait une demande → statut `PENDING`
- Les dates sont temporairement bloquées

### 2. Acceptation par le propriétaire
- Propriétaire accepte → statut `ACCEPTED`
- **Création automatique du paiement Moneroo**
- URL de paiement envoyée au locataire

### 3. Paiement par le locataire
- Locataire redirigé vers Moneroo
- Paiement du dépôt (20% par défaut)
- Webhook confirme le paiement → statut `CONFIRMED`

### 4. Libération des fonds
- Après le début de la réservation
- Fonds libérés au propriétaire (moins 5% de frais)

## 🛠️ Endpoints API

### Moneroo
- `POST /moneroo/create-payment` - Créer un paiement
- `POST /moneroo/webhook` - Webhook de confirmation
- `POST /moneroo/release-funds` - Libérer les fonds

### Bookings (mis à jour)
- `PATCH /bookings/:id/accept` - Accepter + créer paiement
- `POST /bookings/:id/release-funds` - Libérer les fonds

## ⚙️ Configuration

Variables d'environnement requises :
```env
MONEROO_API_KEY=ta_clef_api
MONEROO_BASE_URL=https://api.moneroo.io/v1
MONEROO_WEBHOOK_SECRET=ta_clef_webhook
```

## 🗄️ Base de données

Nouveaux champs ajoutés à `bookings` :
- `paymentId` - ID du paiement Moneroo
- `payoutId` - ID du payout Moneroo
- `paidAt` - Date de paiement
- `fundsReleased` - Fonds libérés (boolean)
- `fundsReleasedAt` - Date de libération

## 🔐 Sécurité

- Validation des webhooks Moneroo
- Vérification des permissions utilisateur
- Gestion des erreurs de paiement
- Logs détaillés des transactions

## 📱 Frontend Integration

Le frontend devra :
1. Rediriger vers `paymentUrl` après acceptation
2. Gérer les retours de paiement
3. Afficher les statuts de réservation
4. Permettre la libération manuelle des fonds (admin)

## 🚨 Gestion d'erreurs

- Paiement échoué → réservation reste `ACCEPTED`
- Webhook manqué → vérification manuelle possible
- Payout échoué → retry automatique prévu