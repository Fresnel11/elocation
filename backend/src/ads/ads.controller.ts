import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import { Multer } from 'multer';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Annonces')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Créer une nouvelle annonce',
    description: 'Crée une nouvelle annonce pour l\'utilisateur connecté.'
  })
  @ApiBody({ 
    type: CreateAdDto,
    description: 'Informations de l\'annonce à créer'
  })
  @ApiCreatedResponse({ 
    description: 'Annonce créée avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        location: { type: 'string' },
        whatsappNumber: { type: 'string' },
        categoryId: { type: 'string' },
        isAvailable: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides ou validation échouée' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  create(@Body() createAdDto: CreateAdDto, @Request() req) {
    return this.adsService.create(createAdDto, req.user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les annonces avec filtres',
    description: 'Récupère la liste des annonces avec possibilité de filtrage, recherche et pagination.'
  })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche textuelle' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID de la catégorie' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Prix minimum en FCFA' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Prix maximum en FCFA' })
  @ApiQuery({ name: 'location', required: false, description: 'Localisation' })
  @ApiQuery({ name: 'isAvailable', required: false, description: 'Disponibilité' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Champ de tri', enum: ['createdAt', 'price', 'title', 'location'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Ordre de tri', enum: ['ASC', 'DESC'], example: 'DESC' })
  @ApiOkResponse({ 
    description: 'Liste des annonces récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        data: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              location: { type: 'string' },
              isAvailable: { type: 'boolean' },
              category: { type: 'object' },
              user: { type: 'object' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' }
      }
    }
  })
  findAll(@Query() searchAdsDto: SearchAdsDto) {
    return this.adsService.findAll(searchAdsDto);
  }

  @Get('my-ads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer mes annonces',
    description: 'Récupère la liste des annonces créées par l\'utilisateur connecté.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiOkResponse({ 
    description: 'Liste des annonces de l\'utilisateur récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  findMyAds(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.adsService.findUserAds(req.user.id, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer une annonce par ID',
    description: 'Récupère les détails d\'une annonce spécifique.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce' })
  @ApiOkResponse({ 
    description: 'Annonce trouvée avec succès' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Get(':id/whatsapp')
  @ApiOperation({ 
    summary: 'Rediriger vers WhatsApp',
    description: 'Redirige vers WhatsApp avec le numéro de contact de l\'annonce.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce' })
  @ApiOkResponse({ 
    description: 'Redirection WhatsApp réussie' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  redirectToWhatsapp(@Param('id') id: string) {
    return this.adsService.redirectToWhatsapp(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Modifier une annonce',
    description: 'Modifie une annonce existante. Seul le créateur peut modifier son annonce.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce à modifier' })
  @ApiBody({ 
    type: UpdateAdDto,
    description: 'Informations à modifier dans l\'annonce'
  })
  @ApiOkResponse({ 
    description: 'Annonce modifiée avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Vous n\'êtes pas autorisé à modifier cette annonce' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto, @Request() req) {
    return this.adsService.update(id, updateAdDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Supprimer une annonce',
    description: 'Supprime une annonce. Seul le créateur peut supprimer son annonce.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce à supprimer' })
  @ApiOkResponse({ 
    description: 'Annonce supprimée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Vous n\'êtes pas autorisé à supprimer cette annonce' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.adsService.remove(id, req.user);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Basculer le statut de disponibilité',
    description: 'Change le statut de disponibilité d\'une annonce (disponible/indisponible).'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce' })
  @ApiOkResponse({ 
    description: 'Statut basculé avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Vous n\'êtes pas autorisé à modifier cette annonce' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  toggleStatus(@Param('id') id: string, @Request() req) {
    return this.adsService.toggleAdStatus(id, req.user);
  }

  @Post(':id/upload-photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Uploader des photos pour une annonce',
    description: 'Ajoute des photos à une annonce existante. Maximum 5 photos, formats acceptés: JPG, PNG, GIF.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Photos à uploader (max 5)',
        },
      },
    },
  })
  @ApiOkResponse({ 
    description: 'Photos uploadées avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Aucun fichier uploadé ou format non supporté' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Vous n\'êtes pas autorisé à modifier cette annonce' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  @UseInterceptors(
    FilesInterceptor('photos', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880') || 5242880, // 5MB
      },
    }),
  )
  uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const photoUrls = files.map(file => `/uploads/${file.filename}`);
    return this.adsService.uploadPhotos(id, photoUrls, req.user);
  }
}