import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonerooService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('MONEROO_BASE_URL');
    this.apiKey = this.configService.get<string>('MONEROO_API_KEY');
  }

  async initializePayment(paymentData: {
    amount: number;
    currency: string;
    description: string;
    customer: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
    };
    returnUrl: string;
    metadata: any;
  }) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/payments/initialize`,
        {
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          customer: {
            email: paymentData.customer.email,
            first_name: paymentData.customer.firstName,
            last_name: paymentData.customer.lastName,
            phone: paymentData.customer.phone,
          },
          return_url: paymentData.returnUrl,
          metadata: paymentData.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }

  async verifyPayment(paymentId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/payments/${paymentId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }

  async initializePayout(amount: number, recipient: any) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/payouts/initialize`,
        {
          amount,
          currency: 'XOF',
          ...recipient,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }
}