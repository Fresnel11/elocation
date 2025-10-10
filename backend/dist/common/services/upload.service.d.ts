export declare class UploadService {
    private readonly uploadPath;
    constructor();
    uploadFile(file: any, type: 'photo' | 'video'): Promise<string>;
    uploadMultipleFiles(files: any[]): Promise<{
        photos: string[];
        video?: string;
    }>;
    uploadSingleFile(file: any): Promise<{
        url: string;
    }>;
}
