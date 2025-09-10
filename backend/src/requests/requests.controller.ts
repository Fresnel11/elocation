import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    return this.requestsService.create(createRequestDto, req.user.userId);
  }

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.requestsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateRequestCommentDto,
    @Request() req,
  ) {
    return this.requestsService.addComment(id, createCommentDto, req.user.userId);
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.requestsService.updateStatus(id, status);
  }
}