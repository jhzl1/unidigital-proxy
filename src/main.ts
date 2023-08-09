import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';

async function bootstrap() {
  const { API_PATH, API_URL_BASE } = process.env;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use((req: Request, res: Response, next: NextFunction) => {
    const requiredHeader = req.headers['access-api-key'];
    const apiKey = process.env.API_ACCESS_KEY;

    if (requiredHeader === apiKey) {
      next();

      return;
    }

    throw new UnauthorizedException();
  });

  app.use(
    '**',
    createProxyMiddleware({
      target: `${API_URL_BASE}${API_PATH}`,
      changeOrigin: true,
      pathRewrite: {
        [`^${API_PATH}`]: '',
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
