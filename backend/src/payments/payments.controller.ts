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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  initiatePayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.initiatePayment(createPaymentDto, req.user);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Request() req) {
    return this.paymentsService.verifyPayment(verifyPaymentDto, req.user);
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  findMyPayments(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.paymentsService.findUserPayments(req.user.id, paginationDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllPayments(@Query() paginationDto: PaginationDto) {
    return this.paymentsService.findAllPayments(paginationDto);
  }

  @Get('real-estate-access/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  checkRealEstateAccess(@Param('userId') userId: string) {
    return this.paymentsService.hasValidPaymentForRealEstate(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}