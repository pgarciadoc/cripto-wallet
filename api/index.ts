import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

const app = express();
let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(app),
    );

    await nestApp.init();

    cachedServer = serverless(app);
  }

  return cachedServer;
}

export default async function handler(req, res) {
  const server = await bootstrap();
  return server(req, res);
}