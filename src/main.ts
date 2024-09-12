import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      //disableErrorMessages: true,
    }),
  );

  const logger = new Logger('Bootstrap');
  logger.log('Application is starting...');

  await app.listen(3000);
  logger.log('Application is listening on port 3000');
}
bootstrap();
