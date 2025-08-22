import { Controller, Post, Body, UseGuards, Get, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        otpPreview: { type: 'string', example: '123456' },
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
    description: 'Envoie un nouveau code OTP par SMS au numéro de téléphone spécifié.'
  })
  @ApiBody({ 
    type: RequestOtpDto,
    description: 'Numéro de téléphone pour recevoir le code OTP'
  })
  @ApiOkResponse({ 
    description: 'Code OTP envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP code sent successfully.' },
        phone: { type: 'string', example: '+22999154678' },
        otpPreview: { type: 'string', example: '123456' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Numéro de téléphone invalide' 
  })
  requestOtp(@Body() body: RequestOtpDto) {
    return this.authService.requestOtp(body.phone);
  }

  @Post('verify-otp')
  @ApiOperation({ 
    summary: 'Vérifier le code OTP',
    description: 'Vérifie le code OTP reçu par SMS et active le compte utilisateur.'
  })
  @ApiBody({ 
    type: VerifyOtpDto,
    description: 'Code OTP et numéro de téléphone à vérifier'
  })
  @ApiOkResponse({ 
    description: 'OTP vérifié avec succès. Le compte est maintenant actif.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP verified successfully. Account activated.' },
        user: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Code OTP invalide ou expiré' 
  })
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.phone, body.code);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur avec email/phone et mot de passe. Retourne un token JWT.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Identifiants de connexion (email OU phone + mot de passe)'
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
    description: 'Identifiants invalides ou compte non activé' 
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
}