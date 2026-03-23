import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await app.init();
  }
  return server;
}

export default async function handler(req, res) {
  const app = await createApp();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
  return app(req, res);
}
