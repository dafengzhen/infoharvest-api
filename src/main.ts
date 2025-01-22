import type { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { DynamicValidationPipe } from './common/pipes/dynamic-validation.pipe';
import { NoEmptyInterceptor } from './interceptor/noempty.interceptor';
import { XPoweredByInterceptor } from './interceptor/xpoweredby.interceptor';

/**
 * bootstrap.
 *
 * @author dafengzhen
 */
async function bootstrap() {
  let cors: boolean | CorsOptions | CorsOptionsDelegate<any>;
  const corsOrigin = process.env.CORS_ORIGIN;
  if (typeof corsOrigin === 'string' && corsOrigin !== '') {
    cors = {
      credentials: true,
      origin: corsOrigin.split(','),
    };
  } else {
    cors = true;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
    rawBody: true,
  });
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new NoEmptyInterceptor());
  if (process.env.POWERED_BY_HEADER === 'true') {
    app.useGlobalInterceptors(new XPoweredByInterceptor('infoharvest'));
  }

  app.useGlobalPipes(
    new DynamicValidationPipe(reflector, {
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.useBodyParser('json', { limit: '16mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '16mb' });
  app.use(cookieParser());
  await app.listen(8080);
}

void bootstrap();
