import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import {setupSwagger} from "./common/util/swagger";
import { ConfigService } from './config';
import {ValidationPipe} from "@nestjs/common";
import {AllExceptionsFilter} from "./filters/all-exceptions.filter";
import {RolesGuard} from "./api/auth/guard/role.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
  );

  app.enableCors();
  setupSwagger(app);

  const port = configService.get('APP_PORT');
  await app.listen(port);
  // console.info(`Server listening on port ${port}`);
}
bootstrap();
