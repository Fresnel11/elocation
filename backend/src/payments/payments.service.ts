import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { User } from '../users/entities/user.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { PaymentProvider } from '../common/enums/payment-provider.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {}

  async initiatePayment(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      transactionId: uuidv4(),
      userId: user.id,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Simulate mobile money API call
    await this.simulateMobileMoneyRequest(savedPayment);

    return savedPayment;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto, user: User): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { 
        transactionId: verifyPaymentDto.transactionCode,
        userId: user.id 
      },
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment has already been processed');
    }

    // Simulate payment verification
    const isPaymentSuccessful = await this.simulatePaymentVerification(payment);

    if (isPaymentSuccessful) {
      payment.status = PaymentStatus.COMPLETED;
      payment.externalTransactionId = `EXT_${Date.now()}`;
    } else {
      payment.status = PaymentStatus.FAILED;
    }

    return this.paymentRepository.save(payment);
  }

  async findUserPayments(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAllPayments(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [payments, total] = await this.paymentRepository.findAndCount({
      relations: ['user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async hasValidPaymentForRealEstate(userId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({
      where: {
        userId,
        status: PaymentStatus.COMPLETED,
        description: 'Real Estate Contact Access',
      },
      order: { createdAt: 'DESC' },
    });

    if (!payment) {
      return false;
    }

    // Check if payment is still valid (e.g., within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return payment.createdAt > thirtyDaysAgo;
  }

  private async simulateMobileMoneyRequest(payment: Payment): Promise<void> {
    // Simulate API call to MTN or Moov
    console.log(`Initiating ${payment.provider.toUpperCase()} Mobile Money payment:`, {
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      transactionId: payment.transactionId,
    });

    // In a real implementation, you would make actual API calls to MTN/Moov here
    // For now, we're just logging the request
  }

  private async simulatePaymentVerification(payment: Payment): Promise<boolean> {
    // Simulate payment verification logic
    // In a real implementation, you would verify with the mobile money provider
    
    // For simulation purposes, let's say 80% of payments are successful
    const isSuccessful = Math.random() < 0.8;
    
    console.log(`Payment verification for ${payment.transactionId}:`, isSuccessful ? 'SUCCESS' : 'FAILED');
    
    return isSuccessful;
  }
}