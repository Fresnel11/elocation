import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePublicKeyDto } from './dto/update-public-key.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ReviewsService } from '../reviews/reviews.service';

@ApiTags('Utilisateurs')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Créer un nouvel utilisateur',
    description: 'Crée un nouvel utilisateur. Réservé aux administrateurs.'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Informations de l\'utilisateur à créer'
  })
  @ApiCreatedResponse({ 
    description: 'Utilisateur créé avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer tous les utilisateurs',
    description: 'Récupère la liste de tous les utilisateurs avec pagination. Réservé aux administrateurs.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiOkResponse({ 
    description: 'Liste des utilisateurs récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    console.log('=== UPDATE PROFILE DEBUG ===');
    console.log('Headers:', req.headers.authorization);
    console.log('User from JWT:', req.user);
    console.log('Received profile update data:', updateProfileDto);
    console.log('============================');
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('export-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Exporter toutes les données de l\'utilisateur' })
  async exportUserData(@Request() req) {
    console.log('Route export-data appelée pour l\'utilisateur:', req.user.id);
    const data = await this.usersService.exportUserData(req.user.id);
    console.log('Données exportées:', Object.keys(data));
    return data;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir le profil utilisateur' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    return {
      ...user.profile,
      phone: user.phone // Inclure le téléphone de l'utilisateur
    };
  }

  @Patch('public-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour la clé publique pour le chiffrement E2E' })
  updatePublicKey(@Request() req, @Body() updatePublicKeyDto: UpdatePublicKeyDto) {
    return this.usersService.updatePublicKey(req.user.id, updatePublicKeyDto.publicKey);
  }

  @Get(':id/public-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer la clé publique d\'un utilisateur' })
  getPublicKey(@Param('id') id: string) {
    return this.usersService.getPublicKey(id);
  }

  @Get(':id/profile')
  @ApiOperation({ 
    summary: 'Récupérer le profil public d\'un utilisateur',
    description: 'Récupère les informations publiques d\'un utilisateur (nom, date d\'inscription, statistiques).'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiOkResponse({ 
    description: 'Profil utilisateur récupéré avec succès' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer un utilisateur par ID',
    description: 'Récupère les détails d\'un utilisateur spécifique.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiOkResponse({ 
    description: 'Utilisateur trouvé avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Modifier un utilisateur',
    description: 'Modifie un utilisateur existant. Les utilisateurs peuvent modifier leur propre profil, les admins peuvent modifier n\'importe quel profil.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur à modifier' })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'Informations à modifier dans le profil utilisateur'
  })
  @ApiOkResponse({ 
    description: 'Utilisateur modifié avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Vous n\'êtes pas autorisé à modifier ce profil' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Supprimer un utilisateur',
    description: 'Supprime un utilisateur. Réservé aux administrateurs.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur à supprimer' })
  @ApiOkResponse({ 
    description: 'Utilisateur supprimé avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Basculer le statut d\'un utilisateur',
    description: 'Active ou désactive un utilisateur. Réservé aux administrateurs.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiOkResponse({ 
    description: 'Statut de l\'utilisateur basculé avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Uploader un avatar' })
  async uploadAvatar(@Request() req, @Body('avatarUrl') avatarUrl: string) {
    return this.usersService.uploadAvatar(req.user.id, avatarUrl);
  }

  @Get(':id/reputation')
  @ApiOperation({ 
    summary: 'Récupérer la réputation d\'un utilisateur',
    description: 'Récupère les statistiques de réputation basées sur les avis reçus.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiOkResponse({ 
    description: 'Réputation récupérée avec succès' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  async getUserReputation(@Param('id') id: string) {
    const reviews = await this.reviewsService.getUserReviews(id);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reputationLevel: 'Nouveau',
        reputationScore: 0
      };
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const totalReviews = reviews.length;
    
    let reputationLevel = 'Nouveau';
    let reputationScore = 0;
    
    if (averageRating >= 4.5 && totalReviews >= 10) {
      reputationLevel = 'Excellent';
      reputationScore = 90 + Math.min(10, totalReviews - 10);
    } else if (averageRating >= 4 && totalReviews >= 5) {
      reputationLevel = 'Très bon';
      reputationScore = 70 + (averageRating - 4) * 40;
    } else if (averageRating >= 3.5 && totalReviews >= 3) {
      reputationLevel = 'Bon';
      reputationScore = 50 + (averageRating - 3.5) * 40;
    } else if (totalReviews > 0) {
      reputationLevel = 'Moyen';
      reputationScore = Math.max(20, averageRating * 20);
    }
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      reputationLevel,
      reputationScore: Math.min(100, Math.round(reputationScore))
    };
  }

  @Post('verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Soumettre une demande de vérification d\'identité' })
  @ApiBody({ type: SubmitVerificationDto })
  async submitVerification(@Request() req, @Body() submitVerificationDto: SubmitVerificationDto) {
    return this.usersService.submitVerification(req.user.id, submitVerificationDto);
  }

  @Get('verification/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer les demandes de vérification en attente' })
  async getPendingVerifications() {
    return this.usersService.getPendingVerifications();
  }

  @Patch('verification/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approuver ou rejeter une demande de vérification' })
  @ApiParam({ name: 'id', description: 'ID de la demande de vérification' })
  @ApiBody({ type: ReviewVerificationDto })
  async reviewVerification(
    @Param('id') id: string,
    @Body() reviewDto: ReviewVerificationDto,
    @Request() req
  ) {
    return this.usersService.reviewVerification(id, reviewDto, req.user.id);
  }

  @Get('verification/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vérifier le statut de vérification de l\'utilisateur' })
  async getVerificationStatus(@Request() req) {
    const verification = await this.usersService.getUserVerification(req.user.id);
    const user = await this.usersService.findOne(req.user.id);
    return {
      isVerified: user.isVerified,
      verification
    };
  }
}