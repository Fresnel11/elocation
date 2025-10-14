import { Controller, Post, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from '../services/upload.service';
import { UsersService } from '../../users/users.service';


@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService
  ) {}

  @Post('files')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    })
  )
  async uploadFiles(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const result = await this.uploadService.uploadMultipleFiles(files);
    return {
      message: 'Fichiers uploadés avec succès',
      ...result
    };
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max for avatar
      },
    })
  )
  async uploadAvatar(@UploadedFile() file: any, @Request() req) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const result = await this.uploadService.uploadSingleFile(file);
    
    // Mettre à jour le profil utilisateur avec l'URL de l'avatar
    await this.usersService.updateProfile(req.user.id, { avatar: result.url });
    
    // Mettre à jour aussi le champ profilePicture dans la table users
    await this.usersService.update(req.user.id, { profilePicture: result.url });
    
    return {
      message: 'Avatar uploadé avec succès',
      url: result.url
    };
  }
}