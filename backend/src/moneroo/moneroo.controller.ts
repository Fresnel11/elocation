import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { MonerooService } from './moneroo.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PayoutDto } from './dto/payout.dto';
import { BookingsService } from '../bookings/bookings.service';

@Controller('moneroo')
export class MonerooController {
  constructor(
    private readonly monerooService: MonerooService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency, metadata } = createPaymentDto;
    return await this.monerooService.initializePayment(amount, currency, metadata);
  }

  @Post('webhook')
  async webhook(@Req() req, @Res() res) {
    const event = req.body;
    console.log('Webhook Moneroo reçu :', event);

    try {
      if (event.status === 'success' && event.metadata?.bookingId) {
        // Confirmer le paiement de la réservation
        await this.bookingsService.confirmPayment(event.metadata.bookingId, {
          payment_id: event.payment_id,
          amount: event.amount,
          currency: event.currency,
        });
        
        console.log(`Paiement confirmé pour la réservation ${event.metadata.bookingId}`);
      }
    } catch (error) {
      console.error('Erreur lors du traitement du webhook Moneroo:', error);
      // On retourne quand même 200 pour éviter les retry de Moneroo
    }

    return res.status(200).send('OK');
  }

  @Post('release-funds')
  async releaseFunds(@Body() payoutDto: PayoutDto) {
    const { amount, recipient } = payoutDto;
    return await this.monerooService.initializePayout(amount, recipient);
  }
}