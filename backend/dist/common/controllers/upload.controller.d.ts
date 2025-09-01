import { UploadService } from '../services/upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFiles(files: any[]): Promise<{
        photos: string[];
        video?: string;
        message: string;
    }>;
}
