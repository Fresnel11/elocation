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
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Utilisateurs')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}