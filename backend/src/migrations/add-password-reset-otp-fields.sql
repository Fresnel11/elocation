-- Migration pour ajouter les champs OTP spécifiques à la réinitialisation de mot de passe
ALTER TABLE users 
ADD COLUMN resetPasswordOtp VARCHAR(6) NULL,
ADD COLUMN resetPasswordOtpExpiresAt TIMESTAMP NULL;