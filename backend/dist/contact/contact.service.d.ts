import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
import { EmailService } from '../notifications/services/email.service';
export declare class ContactService {
    private contactRepository;
    private emailService;
    constructor(contactRepository: Repository<Contact>, emailService: EmailService);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    markAsRead(id: number): Promise<void>;
    reply(id: number, replyDto: ReplyContactDto): Promise<void>;
}
