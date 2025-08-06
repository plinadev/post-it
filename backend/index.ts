import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';

const server = express();
let isAppInitialized = false;

const bootstrap = async () => {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
    isAppInitialized = true;
  }
};

export const api = functions.https.onRequest(async (req, res) => {
  await bootstrap();
  return server(req, res);
});
