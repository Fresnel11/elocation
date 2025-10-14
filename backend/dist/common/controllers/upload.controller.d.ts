import { UploadService } from '../services/upload.service';
import { UsersService } from '../../users/users.service';
export declare class UploadController {
    private readonly uploadService;
    private readonly usersService;
    constructor(uploadService: UploadService, usersService: UsersService);
    uploadFiles(files: any[]): Promise<{
        photos: string[];
        video?: string;
        message: string;
    }>;
    uploadAvatar(file: any, req: any): Promise<{
        message: string;
        url: string;
    }>;
}
