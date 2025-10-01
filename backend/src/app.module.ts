import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdsModule } from './ads/ads.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { RolesModule } from './roles/roles.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestsModule } from './requests/requests.module';
import { ResponsesModule } from './responses/responses.module';
import { BookingsModule } from './bookings/bookings.module';
import { CommonModule } from './common/common.module';
import { SeederModule } from './seeders/seeder.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    AdsModule,
    CategoriesModule,
    PaymentsModule,
    AdminModule,
    RolesModule,
    SubCategoriesModule,
    ReviewsModule,
    MessagesModule,
    NotificationsModule,
    RequestsModule,
    ResponsesModule,
    BookingsModule,
    CommonModule,
    SeederModule,
    AiModule,
  ],
})
export class AppModule {}