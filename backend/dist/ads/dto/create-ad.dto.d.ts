export declare class CreateAdDto {
    title: string;
    description: string;
    price: number;
    location: string;
    whatsappNumber: string;
    categoryId: string;
    subCategoryId?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    amenities?: string[];
    photos?: string[];
    video?: string;
    isAvailable?: boolean;
}
