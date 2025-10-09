import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("./entities/contact.entity").Contact>;
    findAll(): Promise<import("./entities/contact.entity").Contact[]>;
    markAsRead(id: string): Promise<void>;
    reply(id: string, replyDto: ReplyContactDto): Promise<void>;
}
