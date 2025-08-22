import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdminService } from './admin.service';

@ApiTags('Administration')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ 
    summary: 'Récupérer les statistiques du dashboard',
    description: 'Récupère les statistiques globales pour le tableau de bord administrateur.'
  })
  @ApiOkResponse({ 
    description: 'Statistiques récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', description: 'Nombre total d\'utilisateurs' },
        totalAds: { type: 'number', description: 'Nombre total d\'annonces' },
        pendingAds: { type: 'number', description: 'Nombre d\'annonces en attente' },
        totalPayments: { type: 'number', description: 'Nombre total de paiements' },
        totalRevenue: { type: 'number', description: 'Revenus totaux' }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('pending-ads')
  @ApiOperation({ 
    summary: 'Récupérer les annonces en attente de modération',
    description: 'Récupère la liste des annonces qui nécessitent une modération (approbation/rejet).'
  })
  @ApiOkResponse({ 
    description: 'Liste des annonces en attente récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  getPendingAds() {
    return this.adminService.getPendingAds();
  }

  @Patch('ads/:id/moderate')
  @ApiOperation({ 
    summary: 'Modérer une annonce',
    description: 'Approuve ou rejette une annonce en attente de modération.'
  })
  @ApiParam({ name: 'id', description: 'ID de l\'annonce à modérer' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['approve', 'reject'],
          description: 'Action à effectuer sur l\'annonce'
        }
      },
      required: ['action']
    }
  })
  @ApiOkResponse({ 
    description: 'Annonce modérée avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Action invalide' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  @ApiNotFoundResponse({ 
    description: 'Annonce non trouvée' 
  })
  moderateAd(
    @Param('id') id: string,
    @Body('action') action: 'approve' | 'reject',
  ) {
    return this.adminService.moderateAd(id, action);
  }

  @Get('recent-users')
  @ApiOperation({ 
    summary: 'Récupérer les utilisateurs récents',
    description: 'Récupère la liste des utilisateurs les plus récemment inscrits.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Nombre d\'utilisateurs à récupérer', 
    example: 10 
  })
  @ApiOkResponse({ 
    description: 'Liste des utilisateurs récents récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  getRecentUsers(@Query('limit') limit?: string) {
    return this.adminService.getRecentUsers(limit ? parseInt(limit) : 10);
  }

  @Get('recent-payments')
  @ApiOperation({ 
    summary: 'Récupérer les paiements récents',
    description: 'Récupère la liste des paiements les plus récents.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Nombre de paiements à récupérer', 
    example: 10 
  })
  @ApiOkResponse({ 
    description: 'Liste des paiements récents récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  getRecentPayments(@Query('limit') limit?: string) {
    return this.adminService.getRecentPayments(limit ? parseInt(limit) : 10);
  }
}