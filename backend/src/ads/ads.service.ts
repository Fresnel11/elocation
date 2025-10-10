import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PriceAlertsService } from '../price-alerts/price-alerts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ad } from './entities/ad.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    private readonly priceAlertsService: PriceAlertsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createAdDto: CreateAdDto, user: User): Promise<Ad> {
    if (!user.isVerified) {
      throw new ForbiddenException('Vous devez vérifier votre identité pour publier une annonce');
    }

    const whatsappLink = createAdDto.whatsappNumber
      ? `https://wa.me/${createAdDto.whatsappNumber.replace(/\D/g, '')}`
      : undefined;

    const ad = this.adRepository.create({
      ...createAdDto,
      whatsappLink,
      userId: user.id,
    } as Partial<Ad>);

    const savedAd = await this.adRepository.save(ad);
    
    // Vérifier les alertes de recherche après création
    this.checkSearchAlerts(savedAd).catch(err => 
      console.error('Erreur vérification alertes:', err)
    );
    
    return savedAd;
  }

  async findAll(searchAdsDto: SearchAdsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      location,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      userLatitude,
      userLongitude,
      radius = 50,
    } = searchAdsDto;

    const skip = (page - 1) * limit;
    
    let queryBuilder: SelectQueryBuilder<Ad> = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('ad.subCategory', 'subCategory')
      .where('ad.isActive = :isActive', { isActive: true });



    if (search) {
      queryBuilder.andWhere(
        '(ad.title ILIKE :search OR ad.description ILIKE :search OR ad.location ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('ad.categoryId = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('ad.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('ad.price <= :maxPrice', { maxPrice });
    }

    if (location) {
      queryBuilder.andWhere('ad.location ILIKE :location', { location: `%${location}%` });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('ad.isAvailable = :isAvailable', { isAvailable });
    }

    const validSortFields = ['createdAt', 'price', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    queryBuilder.orderBy(`ad.${sortField}` as any, sortOrder as any);
    
    queryBuilder.skip(skip).take(limit);

    const [ads, total] = await queryBuilder.getManyAndCount();

    return {
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Ad> {
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'subCategory'],
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return ad;
  }

  async findUserAds(userId: string, searchAdsDto: SearchAdsDto) {
    const { page = 1, limit = 10 } = searchAdsDto;
    const skip = (page - 1) * limit;

    const [ads, total] = await this.adRepository.findAndCount({
      where: { 
        userId,
        isActive: true,
        isAvailable: true
      },
      relations: ['category', 'subCategory', 'user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateAdDto: UpdateAdDto, user: User): Promise<Ad> {
    const ad = await this.findOne(id);

    if (ad.userId !== user.id && user.role.name !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own ads');
    }

    const previousPrice = ad.price;
    const whatsappLink = updateAdDto.whatsappNumber
      ? `https://wa.me/${updateAdDto.whatsappNumber.replace(/\D/g, '')}`
      : ad.whatsappLink;

    Object.assign(ad, { ...updateAdDto, whatsappLink });
    const updatedAd = await this.adRepository.save(ad);
    
    if (updateAdDto.price && updateAdDto.price !== previousPrice) {
      await this.priceAlertsService.checkPriceChanges(id, updateAdDto.price, previousPrice);
    }
    
    return updatedAd;
  }

  async remove(id: string, user: User): Promise<void> {
    const ad = await this.findOne(id);

    if (ad.userId !== user.id && user.role.name !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own ads');
    }

    await this.adRepository.remove(ad);
  }

  async toggleAdStatus(id: string, user: User): Promise<Ad> {
    const ad = await this.findOne(id);

    if (ad.userId !== user.id && user.role.name !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only toggle your own ads');
    }

    ad.isActive = !ad.isActive;
    return this.adRepository.save(ad);
  }

  async redirectToWhatsapp(id: string): Promise<{ whatsappLink: string }> {
    const ad = await this.findOne(id);

    if (!ad.whatsappLink) {
      throw new BadRequestException('WhatsApp contact not available for this ad');
    }

    return { whatsappLink: ad.whatsappLink };
  }

  async uploadPhotos(id: string, photos: string[], user: User): Promise<Ad> {
    const ad = await this.findOne(id);

    if (ad.userId !== user.id && user.role.name !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update photos for your own ads');
    }

    if (photos.length > 5) {
      throw new BadRequestException('Maximum 5 photos allowed');
    }

    ad.photos = photos;
    return this.adRepository.save(ad);
  }

  private async checkSearchAlerts(ad: Ad): Promise<void> {
    // Cette méthode sera appelée par le service cron
    // Pas besoin d'implémentation ici car gérée par NotificationCronService
  }
}