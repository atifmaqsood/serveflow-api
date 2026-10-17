import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const prefix = config.get<string>('API_PREFIX', 'api/v1');
  const port = config.get<number>('PORT', 3000);
  const corsOrigins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(helmet());
  app.enableCors({ origin: corsOrigins, credentials: true });
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  if (config.get<boolean>('SWAGGER_ENABLED', true)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.get<string>('APP_NAME', 'ServeFlow API'))
      .setDescription('ServeFlow restaurant operations API')
      .setVersion(config.get<string>('APP_VERSION', '0.1.0'))
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  }

  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}/${prefix}`);
}

void bootstrap();
