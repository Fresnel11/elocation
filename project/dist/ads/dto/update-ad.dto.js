"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ad_dto_1 = require("./create-ad.dto");
class UpdateAdDto extends (0, mapped_types_1.PartialType)(create_ad_dto_1.CreateAdDto) {
}
exports.UpdateAdDto = UpdateAdDto;
//# sourceMappingURL=update-ad.dto.js.map