import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ClientModule} from "./api/client/client.module";
import {EtherWalletModule} from "./api/wallet/ether-wallet.module";
import {LoggerMiddleware} from "./middleware/logger.middleware";
import {AuthModule} from "./api/auth/auth.module";
import { MySQLModule } from './database/mysql.module';
import {HealthModule} from "./api/health/health.module";
import { DepositModule } from './api/deposit/deposit.module';

@Module({
  imports: [
    HealthModule,
    MySQLModule,
    AuthModule,
    ClientModule,
    EtherWalletModule,
    DepositModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
