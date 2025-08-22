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
    .setDescription('API documentation for eLocation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 eLocation API is running on: http://localhost:${port}`);
  console.log(`📘 Swagger UI available at: http://localhost:${port}/api-docs`);
}

bootstrap();