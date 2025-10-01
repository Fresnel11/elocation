import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: string): Promise<Request> {
    const request = this.requestRepository.create({
      ...createRequestDto,
      userId,
    });

    return this.requestRepository.save(request);
  }

  async findAll(): Promise<Request[]> {
    return this.requestRepository.find({
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });

    if (!request) {
      throw new NotFoundException('Demande introuvable');
    }

    return request;
  }

  async update(id: string, updateRequestDto: CreateRequestDto, userId: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!request) {
      throw new NotFoundException('Demande introuvable');
    }

    if (request.userId !== userId) {
      throw new ForbiddenException('Vous n\'avez pas l\'autorisation de modifier cette demande');
    }

    await this.requestRepository.update(id, updateRequestDto);
    
    const updatedRequest = await this.requestRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });

    if (!updatedRequest) {
      throw new NotFoundException('Demande introuvable après mise à jour');
    }

    return updatedRequest;
  }
}