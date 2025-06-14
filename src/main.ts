import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/errors/GlobalExceptionFilter';
import { swaggerTags } from './common/constants/constants';
import { API_CONFIG, AUTH_CONFIG, SECURITY_HEADERS } from './config/app.config';
import { StudentDTO } from './modules/students/dto/student.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      validationError: {
        target: false,
        value: false,
      }
    }),
  );

  const configBuilder = new DocumentBuilder()
    .setTitle(API_CONFIG.title)
    .setDescription(API_CONFIG.description)
    .setVersion(API_CONFIG.version)
    .addBearerAuth(AUTH_CONFIG.bearerAuth, AUTH_CONFIG.bearerAuth.key)
    .addApiKey(AUTH_CONFIG.apiKeyAppKey, AUTH_CONFIG.apiKeyAppKey.key)
    .addApiKey(AUTH_CONFIG.apiKeyClientId, AUTH_CONFIG.apiKeyClientId.key);

  swaggerTags.forEach((tag) => configBuilder.addTag(tag.name, tag.description));
  const swaggerConfig = configBuilder.build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Apply security to all paths
  document.paths = Object.entries(document.paths).reduce(
    (paths, [path, methods]) => {
      paths[path] = Object.entries(methods).reduce(
        (operations, [method, operation]) => {
          operations[method] = {
            ...operation,
            security: SECURITY_HEADERS,
          };
          return operations;
        },
        {},
      );
      return paths;
    },
    {},
  );

  SwaggerModule.setup('v1/swagger-ui', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
