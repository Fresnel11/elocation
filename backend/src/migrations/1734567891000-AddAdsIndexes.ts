import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdsIndexes1734567891000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Index pour la localisation
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_location" ON "ads" ("location")`);
    
    // Index pour le tri par date
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_created_at" ON "ads" ("createdAt" DESC)`);
    
    // Index pour le prix
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_price" ON "ads" ("price")`);
    
    // Index pour le statut actif
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_is_active" ON "ads" ("isActive")`);
    
    // Index composé pour les requêtes fréquentes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_active_available" ON "ads" ("isActive", "isAvailable")`);
    
    // Index pour la catégorie
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ads_category_id" ON "ads" ("categoryId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_location"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_price"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_active_available"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ads_category_id"`);
  }
}