"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const fs = require("fs");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('eLocation API')
        .setDescription('API documentation for eLocation')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api-docs', app, swaggerDocument, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 eLocation API is running on: http://localhost:${port}`);
    console.log(`📘 Swagger UI available at: http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map