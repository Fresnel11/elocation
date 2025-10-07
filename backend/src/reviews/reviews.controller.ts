import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get('ad/:adId')
  findByAd(@Param('adId') adId: string) {
    return this.reviewsService.findByAd(adId);
  }

  @Get('ad/:adId/rating')
  getAdRating(@Param('adId') adId: string) {
    return this.reviewsService.getAdRating(adId);
  }

  @Get('user/:userId')
  getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard)
  getPendingReviews(@Request() req) {
    return this.reviewsService.getPendingReviews();
  }

  @Post('admin/:id/approve')
  @UseGuards(JwtAuthGuard)
  approveReview(@Param('id') id: string, @Request() req) {
    return this.reviewsService.approveReview(id);
  }

  @Post('admin/:id/reject')
  @UseGuards(JwtAuthGuard)
  rejectReview(@Param('id') id: string, @Request() req) {
    return this.reviewsService.rejectReview(id);
  }
}