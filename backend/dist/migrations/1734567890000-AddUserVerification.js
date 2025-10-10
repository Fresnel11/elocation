"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserVerification1734567890000 = void 0;
const typeorm_1 = require("typeorm");
class AddUserVerification1734567890000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN isVerified BOOLEAN DEFAULT FALSE
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_verifications',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'selfiePhoto',
                    type: 'varchar',
                    length: '500',
                    isNullable: false,
                },
                {
                    name: 'documentType',
                    type: 'enum',
                    enum: ['cni', 'cip', 'passport'],
                    isNullable: false,
                },
                {
                    name: 'documentFrontPhoto',
                    type: 'varchar',
                    length: '500',
                    isNullable: false,
                },
                {
                    name: 'documentBackPhoto',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'approved', 'rejected'],
                    default: "'pending'",
                    isNullable: false,
                },
                {
                    name: 'rejectionReason',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'reviewedBy',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'reviewedAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
            indices: [
                {
                    name: 'IDX_USER_VERIFICATION_USER_ID',
                    columnNames: ['userId'],
                },
                {
                    name: 'IDX_USER_VERIFICATION_STATUS',
                    columnNames: ['status'],
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('user_verifications');
        await queryRunner.query(`ALTER TABLE users DROP COLUMN isVerified`);
    }
}
exports.AddUserVerification1734567890000 = AddUserVerification1734567890000;
//# sourceMappingURL=1734567890000-AddUserVerification.js.map