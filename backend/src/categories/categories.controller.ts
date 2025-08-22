import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiParam,
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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Catégories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Créer une nouvelle catégorie',
    description: 'Crée une nouvelle catégorie d\'annonces. Réservé aux administrateurs.'
  })
  @ApiBody({ 
    type: CreateCategoryDto,
    description: 'Informations de la catégorie à créer'
  })
  @ApiCreatedResponse({ 
    description: 'Catégorie créée avec succès' 
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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les catégories',
    description: 'Récupère la liste de toutes les catégories d\'annonces disponibles.'
  })
  @ApiOkResponse({ 
    description: 'Liste des catégories récupérée avec succès' 
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer une catégorie par ID',
    description: 'Récupère les détails d\'une catégorie spécifique.'
  })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiOkResponse({ 
    description: 'Catégorie trouvée avec succès' 
  })
  @ApiNotFoundResponse({ 
    description: 'Catégorie non trouvée' 
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Modifier une catégorie',
    description: 'Modifie une catégorie existante. Réservé aux administrateurs.'
  })
  @ApiParam({ name: 'id', description: 'ID de la catégorie à modifier' })
  @ApiBody({ 
    type: UpdateCategoryDto,
    description: 'Informations à modifier dans la catégorie'
  })
  @ApiOkResponse({ 
    description: 'Catégorie modifiée avec succès' 
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
  @ApiNotFoundResponse({ 
    description: 'Catégorie non trouvée' 
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Supprimer une catégorie',
    description: 'Supprime une catégorie. Réservé aux administrateurs.'
  })
  @ApiParam({ name: 'id', description: 'ID de la catégorie à supprimer' })
  @ApiOkResponse({ 
    description: 'Catégorie supprimée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  @ApiNotFoundResponse({ 
    description: 'Catégorie non trouvée' 
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Initialiser les catégories par défaut',
    description: 'Crée les catégories de base pour l\'application. Réservé aux administrateurs.'
  })
  @ApiOkResponse({ 
    description: 'Catégories initialisées avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  seed() {
    return this.categoriesService.seed();
  }
}