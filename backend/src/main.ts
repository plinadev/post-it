/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const allowedOrigin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : process.env.FRONTEND_ORIGIN;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: allowedOrigin, // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // if you use cookies or auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
