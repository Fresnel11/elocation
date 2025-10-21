import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { WebSocketServerService } from './websocket/websocket.server';
import { MessagesService } from './messages/messages.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
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
import { PermissionsModule } from './permissions/permissions.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PriceAlertsModule } from './price-alerts/price-alerts.module';
import { ReportsModule } from './reports/reports.module';
import { ReferralsModule } from './referrals/referrals.module';
import { SocialModule } from './social/social.module';
import { SupportModule } from './support/support.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContactModule } from './contact/contact.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ABTestingModule } from './ab-testing/ab-testing.module';
import { MonerooModule } from './moneroo/moneroo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
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
    PermissionsModule,
    FavoritesModule,
    PriceAlertsModule,
    ReportsModule,
    ReferralsModule,
    SocialModule,
    SupportModule,
    AnalyticsModule,
    ContactModule,
    RecommendationsModule,
    ABTestingModule,
    MonerooModule,
  ],
  providers: [JwtService, WebSocketServerService, NotificationsGateway],
})
export class AppModule implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private webSocketServerService: WebSocketServerService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  onModuleInit() {
    this.messagesService.setWebSocketServer(this.webSocketServerService);
    this.webSocketServerService.setNotificationsGateway(this.notificationsGateway);
  }
}