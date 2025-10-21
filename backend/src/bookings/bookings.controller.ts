import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Réservations')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une réservation',
    description: 'Crée une nouvelle réservation pour une annonce'
  })
  @ApiCreatedResponse({ description: 'Réservation créée avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides ou dates non disponibles' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer mes demandes de réservation',
    description: 'Récupère les réservations que j\'ai demandées'
  })
  @ApiOkResponse({ description: 'Liste des réservations récupérée avec succès' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  findMyBookings(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.bookingsService.findUserBookings(req.user.id, paginationDto);
  }

  @Get('received-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer les demandes reçues',
    description: 'Récupère les demandes de réservation pour mes propriétés'
  })
  @ApiOkResponse({ description: 'Liste des demandes reçues récupérée avec succès' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  findReceivedBookings(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.bookingsService.findOwnerBookings(req.user.id, paginationDto);
  }

  @Get('ad/:adId/availability')
  @ApiOperation({
    summary: 'Vérifier la disponibilité d\'une annonce',
    description: 'Vérifie si une annonce est disponible pour des dates données'
  })
  @ApiParam({ name: 'adId', description: 'ID de l\'annonce' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD)' })
  @ApiOkResponse({ description: 'Disponibilité vérifiée avec succès' })
  checkAvailability(
    @Param('adId') adId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getAdAvailability(adId, startDate, endDate);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer une réservation',
    description: 'Récupère les détails d\'une réservation'
  })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiOkResponse({ description: 'Réservation trouvée avec succès' })
  @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Modifier une réservation',
    description: 'Modifie le statut d\'une réservation'
  })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiOkResponse({ description: 'Réservation modifiée avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  @ApiForbiddenResponse({ description: 'Pas autorisé à modifier cette réservation' })
  @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user);
  }

  @Patch(':id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Accepter une demande de réservation',
    description: 'Accepte une demande de réservation en attente'
  })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiOkResponse({ description: 'Réservation acceptée avec succès' })
  @ApiBadRequestResponse({ description: 'Réservation ne peut pas être acceptée' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  @ApiForbiddenResponse({ description: 'Seul le propriétaire peut accepter' })
  @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
  acceptBooking(@Param('id') id: string, @Request() req) {
    return this.bookingsService.acceptBooking(id, req.user.id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refuser une demande de réservation',
    description: 'Refuse une demande de réservation en attente'
  })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiOkResponse({ description: 'Réservation refusée avec succès' })
  @ApiBadRequestResponse({ description: 'Réservation ne peut pas être refusée' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  @ApiForbiddenResponse({ description: 'Seul le propriétaire peut refuser' })
  @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
  rejectBooking(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.bookingsService.rejectBooking(id, req.user.id, reason);
  }

  @Post(':id/release-funds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Libérer les fonds au propriétaire',
    description: 'Libère les fonds au propriétaire après le début de la réservation'
  })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiOkResponse({ description: 'Fonds libérés avec succès' })
  @ApiBadRequestResponse({ description: 'Réservation non éligible ou fonds déjà libérés' })
  @ApiUnauthorizedResponse({ description: 'Token JWT invalide' })
  @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
  releaseFunds(@Param('id') id: string) {
    return this.bookingsService.releaseFundsToOwner(id);
  }

  @Get('admin/expired')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Traiter les réservations expirées',
    description: 'Marque comme expirées les réservations en attente depuis plus de 24h'
  })
  @ApiOkResponse({ description: 'Réservations expirées traitées avec succès' })
  processExpiredBookings() {
    return this.bookingsService.processExpiredBookings();
  }
}