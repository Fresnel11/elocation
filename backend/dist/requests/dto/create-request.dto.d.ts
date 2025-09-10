export declare class CreateRequestDto {
    title: string;
    description: string;
    location: string;
    maxBudget?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    desiredAmenities?: string[];
    categoryId: string;
    desiredBrand?: string;
    desiredModel?: string;
    minYear?: number;
    desiredCondition?: string;
    desiredColor?: string;
    desiredFuel?: string;
    desiredTransmission?: string;
    maxMileage?: number;
    desiredSize?: string;
    desiredFeatures?: string[];
}
