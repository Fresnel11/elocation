"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAdsIndexes1734567891000 = void 0;
class AddAdsIndexes1734567891000 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_location" ON "ads" ("location")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_created_at" ON "ads" ("createdAt" DESC)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_price" ON "ads" ("price")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_is_active" ON "ads" ("isActive")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_active_available" ON "ads" ("isActive", "isAvailable")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_category_id" ON "ads" ("categoryId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_location"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_price"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_is_active"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_active_available"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_category_id"`);
    }
}
exports.AddAdsIndexes1734567891000 = AddAdsIndexes1734567891000;
//# sourceMappingURL=1734567891000-AddAdsIndexes.js.map