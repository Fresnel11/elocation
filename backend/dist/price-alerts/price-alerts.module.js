"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceAlertsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const price_alerts_controller_1 = require("./price-alerts.controller");
const price_alerts_service_1 = require("./price-alerts.service");
const price_alert_entity_1 = require("./entities/price-alert.entity");
const favorite_entity_1 = require("../favorites/entities/favorite.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let PriceAlertsModule = class PriceAlertsModule {
};
exports.PriceAlertsModule = PriceAlertsModule;
exports.PriceAlertsModule = PriceAlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([price_alert_entity_1.PriceAlert, favorite_entity_1.Favorite]),
            notifications_module_1.NotificationsModule
        ],
        controllers: [price_alerts_controller_1.PriceAlertsController],
        providers: [price_alerts_service_1.PriceAlertsService],
        exports: [price_alerts_service_1.PriceAlertsService],
    })
], PriceAlertsModule);
//# sourceMappingURL=price-alerts.module.js.map