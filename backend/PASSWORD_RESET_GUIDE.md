# Guide de Réinitialisation de Mot de Passe - eLocation

## Vue d'ensemble

Le système de réinitialisation de mot de passe d'eLocation utilise un processus sécurisé en deux étapes avec des codes OTP (One-Time Password) envoyés par email.

## Processus de Réinitialisation

### 1. Demande de Réinitialisation

**Endpoint:** `POST /auth/forgot-password`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Réponse de succès:**
```json
{
  "message": "Password reset code sent to email",
  "email": "user@example.com",
  "expiresAt": "2025-01-09T15:30:00.000Z"
}
```

### 2. Réinitialisation avec Code OTP

**Endpoint:** `POST /auth/reset-password`

**Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "nouveauMotDePasse123"
}
```

**Réponse de succès:**
```json
{
  "message": "Password reset successfully"
}
```

## Fonctionnalités de Sécurité

### 🔒 Sécurité des Codes OTP
- **Durée de vie:** 10 minutes
- **Usage unique:** Le code est supprimé après utilisation
- **Format:** 6 chiffres aléatoires
- **Validation:** Vérification de l'expiration et de l'exactitude

### 📧 Email de Réinitialisation
- **Design responsive:** Compatible mobile et desktop
- **Branding eLocation:** Couleurs et logo cohérents
- **Informations de sécurité:** Conseils et avertissements
- **Expiration visible:** Affichage du délai d'expiration

## Gestion des Erreurs

### Erreurs Communes

| Code | Message | Description |
|------|---------|-------------|
| 400 | User not found | Email non trouvé dans la base |
| 400 | Invalid or expired OTP | Code incorrect ou expiré |
| 400 | Validation failed | Données invalides (email, mot de passe) |

### Exemples de Réponses d'Erreur

```json
{
  "statusCode": 400,
  "message": "User not found",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP",
  "error": "Bad Request"
}
```

## Validation des Données

### Email
- Format email valide requis
- Insensible à la casse
- Doit exister dans la base de données

### Code OTP
- Exactement 6 chiffres
- Sensible à la casse
- Doit être utilisé avant expiration

### Nouveau Mot de Passe
- Minimum 6 caractères
- Aucune restriction de complexité (configurable)

## Intégration Frontend

### Flux Utilisateur Recommandé

1. **Page "Mot de passe oublié"**
   - Formulaire avec champ email
   - Appel à `/auth/forgot-password`
   - Redirection vers page de saisie du code

2. **Page "Saisie du code"**
   - Formulaire avec code OTP et nouveau mot de passe
   - Appel à `/auth/reset-password`
   - Redirection vers page de connexion

### Exemple d'Implémentation JavaScript

```javascript
// Étape 1: Demande de réinitialisation
async function requestPasswordReset(email) {
  try {
    const response = await fetch('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Code envoyé:', data.message);
      // Rediriger vers la page de saisie du code
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Étape 2: Réinitialisation avec code
async function resetPassword(email, code, newPassword) {
  try {
    const response = await fetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Mot de passe réinitialisé:', data.message);
      // Rediriger vers la page de connexion
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

## Configuration Email

### Variables d'Environnement Requises

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
```

### Configuration Gmail
1. Activer l'authentification à deux facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

## Tests

### Test Manuel avec cURL

```bash
# 1. Demander la réinitialisation
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Réinitialiser avec le code reçu
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","newPassword":"nouveauMdp123"}'
```

## Bonnes Pratiques

### Côté Backend
- ✅ Codes OTP à usage unique
- ✅ Expiration automatique (10 min)
- ✅ Validation stricte des données
- ✅ Logs de sécurité
- ✅ Rate limiting (recommandé)

### Côté Frontend
- ✅ Validation côté client
- ✅ Feedback utilisateur clair
- ✅ Gestion des erreurs
- ✅ Interface responsive
- ✅ Indicateur de temps restant

## Surveillance et Logs

### Logs Générés
```
OTP email sent to user@example.com
Password reset email sent to user@example.com
Password reset successfully for user@example.com
```

### Métriques Recommandées
- Nombre de demandes de réinitialisation
- Taux de succès des réinitialisations
- Temps moyen entre demande et utilisation
- Tentatives avec codes expirés/invalides

---

**Note:** Ce système est conçu pour être sécurisé et user-friendly. Pour des besoins de sécurité renforcée, considérez l'ajout de rate limiting et de captcha.