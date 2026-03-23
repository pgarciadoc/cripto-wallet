import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response, RequestHandler } from 'express';

const expressApp = express();

let cachedServer: RequestHandler;

async function bootstrap(): Promise<RequestHandler> {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    await app.init();
    cachedServer = expressApp as unknown as RequestHandler;
  }

  return cachedServer!;
}

export default async function handler(req: Request, res: Response) {
  const server = await bootstrap();
  return server(req, res, () => {});
}
