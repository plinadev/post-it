import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';

let app: NestExpressApplication | null = null;

async function bootstrap() {
  if (!app) {
    const expressApp = express();

    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    const frontendOrigin = process.env.FRONTEND_ORIGIN ?? '';

    app.enableCors({
      origin: [frontendOrigin, 'http://localhost:5174'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    await app.init();
    console.log('NestJS app initialized');
  }
  return app.getHttpAdapter().getInstance();
}

export const api = functions.https.onRequest(async (req, res) => {
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  const expressApp = await bootstrap();
  expressApp(req, res);
});
