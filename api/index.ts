import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response, NextFunction } from 'express';

const expressApp = express();

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    await app.init();
    cachedServer = expressApp;
  }

  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  const server = await bootstrap();

  return new Promise<void>((resolve, reject) => {
    server(req, res, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
