"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const request_otp_dto_1 = require("./dto/request-otp.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    requestOtp(body) {
        return this.authService.requestOtp(body.email);
    }
    verifyOtp(body) {
        return this.authService.verifyOtp(body.email, body.code);
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    getProfile(req) {
        return req.user;
    }
    async googleAuth(req) {
    }
    async googleAuthRedirect(req, res) {
        const result = req.user;
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.access_token}`);
    }
    forgotPassword(body) {
        return this.authService.forgotPassword(body.email);
    }
    sendPasswordResetCode(body) {
        return this.authService.sendPasswordResetCode(body.email);
    }
    resetPassword(body) {
        return this.authService.resetPassword(body.email, body.code, body.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Inscription d\'un nouvel utilisateur',
        description: 'Crée un nouveau compte utilisateur. Un code OTP sera envoyé par SMS pour vérifier le téléphone.'
    }),
    (0, swagger_1.ApiBody)({
        type: register_dto_1.RegisterDto,
        description: 'Informations d\'inscription de l\'utilisateur'
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Utilisateur créé avec succès. Vérifiez votre téléphone avec le code OTP.',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Registration successful. Verify your phone with the OTP code.' },
                phone: { type: 'string', example: '+22999154678' },
                expiresAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides ou validation échouée'
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Utilisateur déjà existant avec ce téléphone ou email'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('request-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Demander un nouveau code OTP',
        description: 'Envoie un nouveau code OTP par email à l\'adresse spécifiée.'
    }),
    (0, swagger_1.ApiBody)({
        type: request_otp_dto_1.RequestOtpDto,
        description: 'Email pour recevoir le code OTP'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Code OTP envoyé avec succès',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'OTP sent to email' },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Email invalide ou utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_otp_dto_1.RequestOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "requestOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier le code OTP',
        description: 'Vérifie le code OTP reçu par email et active le compte utilisateur.'
    }),
    (0, swagger_1.ApiBody)({
        type: verify_otp_dto_1.VerifyOtpDto,
        description: 'Code OTP et email à vérifier'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OTP vérifié avec succès. Le compte est maintenant actif.',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Email verified. Account activated.' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Code OTP invalide ou expiré'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Connexion utilisateur',
        description: 'Authentifie un utilisateur avec email et mot de passe. Le compte doit être activé via OTP.'
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: 'Identifiants de connexion (email + mot de passe)'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Connexion réussie',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données de connexion invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Identifiants invalides ou compte non activé. Activez votre compte avec le code OTP.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer le profil utilisateur',
        description: 'Récupère les informations du profil de l\'utilisateur connecté.'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profil utilisateur récupéré avec succès',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Connexion avec Google',
        description: 'Redirige vers Google pour l\'authentification OAuth2.'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Redirection vers Google réussie'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Callback Google OAuth2',
        description: 'Traite le retour de Google après authentification.'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Authentification Google réussie'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Rechercher un compte par email',
        description: 'Recherche un compte utilisateur par email sans envoyer de code.'
    }),
    (0, swagger_1.ApiBody)({
        type: forgot_password_dto_1.ForgotPasswordDto,
        description: 'Email pour rechercher le compte'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Compte trouvé avec succès',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User found' },
                email: { type: 'string', example: 'user@example.com' },
                user: { type: 'object' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Email invalide ou utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('send-password-reset-code'),
    (0, swagger_1.ApiOperation)({
        summary: 'Envoyer le code de réinitialisation',
        description: 'Envoie un code OTP par email pour réinitialiser le mot de passe.'
    }),
    (0, swagger_1.ApiBody)({
        type: forgot_password_dto_1.ForgotPasswordDto,
        description: 'Email pour recevoir le code de réinitialisation'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Code de réinitialisation envoyé avec succès',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Password reset code sent to email' },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Email invalide ou utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendPasswordResetCode", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Réinitialiser le mot de passe',
        description: 'Réinitialise le mot de passe avec le code OTP reçu par email.'
    }),
    (0, swagger_1.ApiBody)({
        type: reset_password_dto_1.ResetPasswordDto,
        description: 'Code OTP, email et nouveau mot de passe'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Mot de passe réinitialisé avec succès',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Password reset successfully' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Code OTP invalide, expiré ou données invalides'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map