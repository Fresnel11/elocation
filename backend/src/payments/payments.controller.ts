import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Paiements')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Initier un paiement',
    description: 'Crée un nouveau paiement avec le statut PENDING. Le paiement doit être vérifié ensuite.'
  })
  @ApiBody({ 
    type: CreatePaymentDto,
    description: 'Informations du paiement à initier'
  })
  @ApiCreatedResponse({ 
    description: 'Paiement initié avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  initiatePayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.initiatePayment(createPaymentDto, req.user);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Vérifier un paiement',
    description: 'Vérifie un paiement initié. Simule la vérification avec un taux de succès de 80%.'
  })
  @ApiBody({ 
    type: VerifyPaymentDto,
    description: 'Informations de vérification du paiement'
  })
  @ApiOkResponse({ 
    description: 'Paiement vérifié avec succès' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiNotFoundResponse({ 
    description: 'Paiement non trouvé' 
  })
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Request() req) {
    return this.paymentsService.verifyPayment(verifyPaymentDto, req.user);
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer mes paiements',
    description: 'Récupère la liste des paiements de l\'utilisateur connecté.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiOkResponse({ 
    description: 'Liste des paiements récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  findMyPayments(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.paymentsService.findUserPayments(req.user.id, paginationDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer tous les paiements',
    description: 'Récupère la liste de tous les paiements. Réservé aux administrateurs.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiOkResponse({ 
    description: 'Liste de tous les paiements récupérée avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiForbiddenResponse({ 
    description: 'Accès réservé aux administrateurs' 
  })
  findAllPayments(@Query() paginationDto: PaginationDto) {
    return this.paymentsService.findAllPayments(paginationDto);
  }

  @Get('real-estate-access/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Vérifier l\'accès immobilier d\'un utilisateur',
    description: 'Vérifie si un utilisateur a un paiement valide pour accéder aux contacts immobiliers. Réservé aux administrateurs.'
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur à vérifier' })
  @ApiOkResponse({ 
    description: 'Accès immobilier vérifié avec succès' 
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
  checkRealEstateAccess(@Param('userId') userId: string) {
    return this.paymentsService.hasValidPaymentForRealEstate(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer un paiement par ID',
    description: 'Récupère les détails d\'un paiement spécifique.'
  })
  @ApiParam({ name: 'id', description: 'ID du paiement' })
  @ApiOkResponse({ 
    description: 'Paiement trouvé avec succès' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT invalide ou expiré' 
  })
  @ApiNotFoundResponse({ 
    description: 'Paiement non trouvé' 
  })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}