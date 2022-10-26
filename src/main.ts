import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {setupSwagger} from "./common/util/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(3000);
  // console.info(`Server listening on port ${port}`);
}
bootstrap();
