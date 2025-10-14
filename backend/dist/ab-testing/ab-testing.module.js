"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABTestingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ab_testing_service_1 = require("./ab-testing.service");
const ab_testing_controller_1 = require("./ab-testing.controller");
const ab_test_entity_1 = require("./entities/ab-test.entity");
let ABTestingModule = class ABTestingModule {
};
exports.ABTestingModule = ABTestingModule;
exports.ABTestingModule = ABTestingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ab_test_entity_1.ABTest])],
        controllers: [ab_testing_controller_1.ABTestingController],
        providers: [ab_testing_service_1.ABTestingService],
        exports: [ab_testing_service_1.ABTestingService],
    })
], ABTestingModule);
//# sourceMappingURL=ab-testing.module.js.map