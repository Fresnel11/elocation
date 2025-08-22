import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, {
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

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 eLocation API is running on: http://localhost:${port}`);
  console.log(`📘 Swagger UI available at: http://localhost:${port}/api-docs`);
}

bootstrap();