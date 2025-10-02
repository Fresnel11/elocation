"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const ads_module_1 = require("./ads/ads.module");
const categories_module_1 = require("./categories/categories.module");
const payments_module_1 = require("./payments/payments.module");
const admin_module_1 = require("./admin/admin.module");
const roles_module_1 = require("./roles/roles.module");
const subcategories_module_1 = require("./subcategories/subcategories.module");
const reviews_module_1 = require("./reviews/reviews.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const requests_module_1 = require("./requests/requests.module");
const responses_module_1 = require("./responses/responses.module");
const bookings_module_1 = require("./bookings/bookings.module");
const common_module_1 = require("./common/common.module");
const seeder_module_1 = require("./seeders/seeder.module");
const ai_module_1 = require("./ai/ai.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '3306'),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV === 'development',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            ads_module_1.AdsModule,
            categories_module_1.CategoriesModule,
            payments_module_1.PaymentsModule,
            admin_module_1.AdminModule,
            roles_module_1.RolesModule,
            subcategories_module_1.SubCategoriesModule,
            reviews_module_1.ReviewsModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            requests_module_1.RequestsModule,
            responses_module_1.ResponsesModule,
            bookings_module_1.BookingsModule,
            common_module_1.CommonModule,
            seeder_module_1.SeederModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map