import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAdDto: CreateAdDto, @Request() req) {
    return this.adsService.create(createAdDto, req.user);
  }

  @Get()
  findAll(@Query() searchAdsDto: SearchAdsDto) {
    return this.adsService.findAll(searchAdsDto);
  }

  @Get('my-ads')
  @UseGuards(JwtAuthGuard)
  findMyAds(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.adsService.findUserAds(req.user.id, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Get(':id/whatsapp')
  redirectToWhatsapp(@Param('id') id: string) {
    return this.adsService.redirectToWhatsapp(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto, @Request() req) {
    return this.adsService.update(id, updateAdDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.adsService.remove(id, req.user);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  toggleStatus(@Param('id') id: string, @Request() req) {
    return this.adsService.toggleAdStatus(id, req.user);
  }

  @Post(':id/upload-photos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880') || 5242880, // 5MB
      },
    }),
  )
  uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const photoUrls = files.map(file => `/uploads/${file.filename}`);
    return this.adsService.uploadPhotos(id, photoUrls, req.user);
  }
}