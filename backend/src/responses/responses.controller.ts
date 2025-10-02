import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('responses')
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post('request/:requestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réponse à une demande' })
  create(@Param('requestId') requestId: string, @Body() createResponseDto: CreateResponseDto, @Request() req) {
    return this.responsesService.create(requestId, createResponseDto, req.user.id);
  }

  @Get('request/:requestId')
  @ApiOperation({ summary: 'Récupérer les réponses d\'une demande' })
  findByRequest(@Param('requestId') requestId: string) {
    return this.responsesService.findByRequest(requestId);
  }
}