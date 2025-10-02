export declare class CreateRequestDto {
    title: string;
    description: string;
    location: string;
    maxBudget?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    categoryId: string;
    desiredAmenities?: string[];
}
