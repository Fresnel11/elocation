"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const path = require("path");
let UploadService = class UploadService {
    constructor() {
        this.uploadPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async uploadFile(file, type) {
        const maxSize = type === 'photo' ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException(`Le fichier est trop volumineux. Taille maximale: ${type === 'photo' ? '2MB' : '10MB'}`);
        }
        const allowedTypes = type === 'photo'
            ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            : ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
        }
        const fileExtension = (0, path_1.extname)(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path.join(this.uploadPath, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/${fileName}`;
    }
    async uploadMultipleFiles(files) {
        if (files.length > 5) {
            throw new common_1.BadRequestException('Maximum 5 fichiers autorisés');
        }
        const photos = [];
        let video;
        for (const file of files) {
            const isVideo = file.mimetype.startsWith('video/');
            if (isVideo) {
                if (video) {
                    throw new common_1.BadRequestException('Une seule vidéo autorisée');
                }
                if (photos.length >= 4) {
                    throw new common_1.BadRequestException('Maximum 4 photos avec une vidéo');
                }
                video = await this.uploadFile(file, 'video');
            }
            else {
                if (video && photos.length >= 4) {
                    throw new common_1.BadRequestException('Maximum 4 photos avec une vidéo');
                }
                if (!video && photos.length >= 5) {
                    throw new common_1.BadRequestException('Maximum 5 photos sans vidéo');
                }
                const photoUrl = await this.uploadFile(file, 'photo');
                photos.push(photoUrl);
            }
        }
        return { photos, video };
    }
    async uploadSingleFile(file) {
        const url = await this.uploadFile(file, 'photo');
        return { url };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map