import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {}

  async create(requestId: string, createResponseDto: CreateResponseDto, userId: string): Promise<Response> {
    const response = this.responseRepository.create({
      ...createResponseDto,
      requestId,
      userId,
    });

    return this.responseRepository.save(response);
  }

  async findByRequest(requestId: string): Promise<Response[]> {
    return this.responseRepository.find({
      where: { requestId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}