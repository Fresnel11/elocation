export declare class CreateMessageDto {
    content: string;
    receiverId: string;
    adId?: string;
    imageUrl?: string;
    messageType?: 'text' | 'image';
    isEncrypted?: boolean;
}
