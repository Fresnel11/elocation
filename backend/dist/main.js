"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const fs = require("fs");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const ws_1 = require("ws");
async function bootstrap() {
    if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(require('express').json({ limit: '50mb' }));
    app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:5173'],
        credentials: true,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('eLocation API')
        .setDescription(`
      ## 🏠 Plateforme de mise en relation pour annonces
    `)
        .setVersion('1.0')
        .addTag('Authentication', 'Endpoints d\'authentification et gestion des utilisateurs')
        .addTag('Annonces', 'Gestion des annonces (création, modification, suppression, recherche)')
        .addTag('Catégories', 'Gestion des catégories d\'annonces')
        .addTag('Paiements', 'Gestion des paiements MTN/Moov Mobile Money')
        .addTag('Administration', 'Fonctionnalités d\'administration et modération')
        .addTag('Utilisateurs', 'Gestion des profils utilisateurs')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api-docs', app, swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
        customSiteTitle: 'eLocation API Documentation',
        customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; color: #2563eb; }
      .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
    `,
    });
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    const wss = new ws_1.Server({ port: 3001 });
    const clients = new Map();
    wss.on('connection', (ws, req) => {
        console.log('WebSocket client connected');
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'auth' && data.userId) {
                    clients.set(data.userId, ws);
                    console.log(`User ${data.userId} authenticated on WebSocket`);
                }
            }
            catch (error) {
                console.error('WebSocket message error:', error);
            }
        });
        ws.on('close', () => {
            for (const [userId, client] of clients.entries()) {
                if (client === ws) {
                    clients.delete(userId);
                    console.log(`User ${userId} disconnected from WebSocket`);
                    break;
                }
            }
        });
    });
    global.wsServer = { clients, wss };
    console.log(`🚀 eLocation API is running on: http://localhost:${port}`);
    console.log(`📘 Swagger UI available at: http://localhost:${port}/api-docs`);
    console.log(`🔌 WebSocket server running on: ws://localhost:3001`);
}
bootstrap();
//# sourceMappingURL=main.js.map