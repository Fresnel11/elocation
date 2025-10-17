import { Controller, Post, Body, UseGuards, Get, Request, UseInterceptors, ClassSerializerInterceptor, Res } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Inscription d\'un nouvel utilisateur',
    description: 'Crée un nouveau compte utilisateur. Un code OTP sera envoyé par SMS pour vérifier le téléphone.'
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'Informations d\'inscription de l\'utilisateur'
  })
  @ApiCreatedResponse({ 
    description: 'Utilisateur créé avec succès. Vérifiez votre téléphone avec le code OTP.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Registration successful. Verify your phone with the OTP code.' },
        phone: { type: 'string', example: '+22999154678' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides ou validation échouée' 
  })
  @ApiConflictResponse({ 
    description: 'Utilisateur déjà existant avec ce téléphone ou email' 
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('request-otp')
  @ApiOperation({ 
    summary: 'Demander un nouveau code OTP',
    description: 'Envoie un nouveau code OTP par email à l\'adresse spécifiée.'
  })
  @ApiBody({ 
    type: RequestOtpDto,
    description: 'Email pour recevoir le code OTP'
  })
  @ApiOkResponse({ 
    description: 'Code OTP envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP sent to email' },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Email invalide ou utilisateur non trouvé' 
  })
  requestOtp(@Body() body: RequestOtpDto) {
    return this.authService.requestOtp(body.email);
  }

  @Post('verify-otp')
  @ApiOperation({ 
    summary: 'Vérifier le code OTP',
    description: 'Vérifie le code OTP reçu par email et active le compte utilisateur.'
  })
  @ApiBody({ 
    type: VerifyOtpDto,
    description: 'Code OTP et email à vérifier'
  })
  @ApiOkResponse({ 
    description: 'OTP vérifié avec succès. Le compte est maintenant actif.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email verified. Account activated.' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Code OTP invalide ou expiré' 
  })
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.email, body.code);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur avec email et mot de passe. Le compte doit être activé via OTP.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Identifiants de connexion (email + mot de passe)'
  })
  @ApiOkResponse({ 
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
  })
  @ApiBadRequestResponse({ 
    description: 'Données de connexion invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Identifiants invalides ou compte non activé. Activez votre compte avec le code OTP.' 
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer le profil utilisateur',
    description: 'Récupère les informations du profil de l\'utilisateur connecté.'
  })
  @ApiOkResponse({ 
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
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer les données complètes de l\'utilisateur',
    description: 'Récupère toutes les informations de l\'utilisateur connecté avec son profil.'
  })
  async getMe(@Request() req) {
    const user = await this.authService.getUserWithProfile(req.user.sub);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profile?.avatar || user.profilePicture,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ 
    summary: 'Connexion avec Google',
    description: 'Redirige vers Google pour l\'authentification OAuth2.'
  })
  @ApiOkResponse({ 
    description: 'Redirection vers Google réussie' 
  })
  async googleAuth(@Request() req) {
    // Guard redirige automatiquement vers Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ 
    summary: 'Callback Google OAuth2',
    description: 'Traite le retour de Google après authentification.'
  })
  @ApiOkResponse({ 
    description: 'Authentification Google réussie' 
  })
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const result = req.user;
    // Rediriger vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.access_token}`);
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Rechercher un compte par email',
    description: 'Recherche un compte utilisateur par email sans envoyer de code.'
  })
  @ApiBody({ 
    type: ForgotPasswordDto,
    description: 'Email pour rechercher le compte'
  })
  @ApiOkResponse({ 
    description: 'Compte trouvé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User found' },
        email: { type: 'string', example: 'user@example.com' },
        user: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Email invalide ou utilisateur non trouvé' 
  })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('send-password-reset-code')
  @ApiOperation({ 
    summary: 'Envoyer le code de réinitialisation',
    description: 'Envoie un code OTP par email pour réinitialiser le mot de passe.'
  })
  @ApiBody({ 
    type: ForgotPasswordDto,
    description: 'Email pour recevoir le code de réinitialisation'
  })
  @ApiOkResponse({ 
    description: 'Code de réinitialisation envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset code sent to email' },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Email invalide ou utilisateur non trouvé' 
  })
  sendPasswordResetCode(@Body() body: ForgotPasswordDto) {
    return this.authService.sendPasswordResetCode(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Réinitialiser le mot de passe',
    description: 'Réinitialise le mot de passe avec le code OTP reçu par email.'
  })
  @ApiBody({ 
    type: ResetPasswordDto,
    description: 'Code OTP, email et nouveau mot de passe'
  })
  @ApiOkResponse({ 
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successfully' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Code OTP invalide, expiré ou données invalides' 
  })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.email, body.code, body.newPassword);
  }
}