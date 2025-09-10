import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { RequestComment } from './entities/request-comment.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestComment)
    private requestCommentRepository: Repository<RequestComment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: string): Promise<Request> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const category = await this.categoryRepository.findOne({ where: { id: createRequestDto.categoryId } });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    const request = this.requestRepository.create({
      ...createRequestDto,
      user,
      category,
    });

    return this.requestRepository.save(request);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [requests, total] = await this.requestRepository.findAndCount({
      relations: ['user', 'category', 'comments'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'comments', 'comments.user'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async addComment(requestId: string, createCommentDto: CreateRequestCommentDto, userId: string): Promise<RequestComment> {
    const request = await this.findOne(requestId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.requestCommentRepository.create({
      ...createCommentDto,
      request,
      user,
    });

    return this.requestCommentRepository.save(comment);
  }

  async updateStatus(id: string, status: string): Promise<Request> {
    const request = await this.findOne(id);
    request.status = status;
    return this.requestRepository.save(request);
  }
}