import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    const envFile =
      process.env.NODE_ENV === 'production'
        ? '.env.prod'
        : process.env.NODE_ENV === 'stage'
        ? '.env.stage'
        : '.env';
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  isEnv(env: string): boolean {
    return this.nodeEnv === env;
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }
}
