import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: any, type: 'photo' | 'video'): Promise<string> {
    // Validation de la taille
    const maxSize = type === 'photo' ? 2 * 1024 * 1024 : 10 * 1024 * 1024; // 2MB pour photo, 10MB pour vidéo
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Le fichier est trop volumineux. Taille maximale: ${type === 'photo' ? '2MB' : '10MB'}`
      );
    }

    // Validation du type de fichier
    const allowedTypes = type === 'photo' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      );
    }

    // Générer un nom unique
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Sauvegarder le fichier
    fs.writeFileSync(filePath, file.buffer);

    // Retourner l'URL du fichier
    return `/uploads/${fileName}`;
  }

  async uploadMultipleFiles(files: any[]): Promise<{ photos: string[], video?: string }> {
    if (files.length > 5) {
      throw new BadRequestException('Maximum 5 fichiers autorisés');
    }

    const photos: string[] = [];
    let video: string | undefined;

    for (const file of files) {
      const isVideo = file.mimetype.startsWith('video/');
      
      if (isVideo) {
        if (video) {
          throw new BadRequestException('Une seule vidéo autorisée');
        }
        if (photos.length >= 4) {
          throw new BadRequestException('Maximum 4 photos avec une vidéo');
        }
        video = await this.uploadFile(file, 'video');
      } else {
        if (video && photos.length >= 4) {
          throw new BadRequestException('Maximum 4 photos avec une vidéo');
        }
        if (!video && photos.length >= 5) {
          throw new BadRequestException('Maximum 5 photos sans vidéo');
        }
        const photoUrl = await this.uploadFile(file, 'photo');
        photos.push(photoUrl);
      }
    }

    return { photos, video };
  }
}