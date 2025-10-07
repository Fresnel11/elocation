"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const notifications_service_1 = require("./notifications.service");
const notifications_controller_1 = require("./notifications.controller");
const notifications_gateway_1 = require("./notifications.gateway");
const notification_entity_1 = require("./entities/notification.entity");
const notification_preference_entity_1 = require("./entities/notification-preference.entity");
const search_alert_entity_1 = require("./entities/search-alert.entity");
const push_subscription_entity_1 = require("./entities/push-subscription.entity");
const email_service_1 = require("./services/email.service");
const push_notification_service_1 = require("./services/push-notification.service");
const notification_scheduler_service_1 = require("./services/notification-scheduler.service");
const notification_cron_service_1 = require("./services/notification-cron.service");
const ad_entity_1 = require("../ads/entities/ad.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification, notification_preference_entity_1.NotificationPreference, search_alert_entity_1.SearchAlert, push_subscription_entity_1.PushSubscription, ad_entity_1.Ad, booking_entity_1.Booking]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
            }),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, notifications_gateway_1.NotificationsGateway, email_service_1.EmailService, push_notification_service_1.PushNotificationService, notification_scheduler_service_1.NotificationSchedulerService, notification_cron_service_1.NotificationCronService],
        exports: [notifications_service_1.NotificationsService, push_notification_service_1.PushNotificationService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map