"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropMessagingTables1760949028097 = void 0;
class DropMessagingTables1760949028097 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE messages DROP FOREIGN KEY FK_4c88e956195bba85977da21b8f4`);
        await queryRunner.query(`ALTER TABLE messages DROP FOREIGN KEY FK_36bc604a0a6ffaf3c0f5840cce`);
        await queryRunner.query(`ALTER TABLE messages DROP FOREIGN KEY FK_830d1c0e0fd37c0ba8d7f3b7e4`);
        await queryRunner.query(`ALTER TABLE conversations DROP FOREIGN KEY FK_ee34f4f7ced04b897095e41c5fd`);
        await queryRunner.query(`ALTER TABLE conversations DROP FOREIGN KEY FK_5b4d5e7b0b9c0b9c0b9c0b9c0b`);
        await queryRunner.query(`DROP TABLE messages`);
        await queryRunner.query(`DROP TABLE conversations`);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE conversations (
                id varchar(36) NOT NULL,
                user1Id varchar(255) NOT NULL,
                user2Id varchar(255) NOT NULL,
                adId varchar(255) NULL,
                lastMessageContent varchar(255) NULL,
                lastMessageAt datetime NULL,
                unreadCountUser1 int NOT NULL DEFAULT 0,
                unreadCountUser2 int NOT NULL DEFAULT 0,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE messages (
                id varchar(36) NOT NULL,
                content text NOT NULL,
                isEncrypted tinyint NOT NULL DEFAULT 0,
                imageUrl varchar(500) NULL,
                messageType varchar(10) NOT NULL DEFAULT 'text',
                isRead tinyint NOT NULL DEFAULT 0,
                senderId varchar(255) NOT NULL,
                receiverId varchar(255) NOT NULL,
                adId varchar(255) NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`ALTER TABLE messages ADD CONSTRAINT FK_4c88e956195bba85977da21b8f4 FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE messages ADD CONSTRAINT FK_36bc604a0a6ffaf3c0f5840cce FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE messages ADD CONSTRAINT FK_830d1c0e0fd37c0ba8d7f3b7e4 FOREIGN KEY (adId) REFERENCES ads(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE conversations ADD CONSTRAINT FK_ee34f4f7ced04b897095e41c5fd FOREIGN KEY (user1Id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE conversations ADD CONSTRAINT FK_5b4d5e7b0b9c0b9c0b9c0b9c0b FOREIGN KEY (user2Id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.DropMessagingTables1760949028097 = DropMessagingTables1760949028097;
//# sourceMappingURL=1760949028097-DropMessagingTables.js.map