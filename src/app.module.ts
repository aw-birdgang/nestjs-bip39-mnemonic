import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ClientModule} from "./api/client/client.module";
import {AccountModule} from "./api/account/account.module";
import {LoggerMiddleware} from "./middleware/logger.middleware";
import {AuthModule} from "./api/auth/auth.module";
import { MySQLModule } from './database/mysql.module';
import {HealthModule} from "./api/health/health.module";
import { DepositModule } from './api/deposit/deposit.module';
import {MoralisModule} from "./moralis";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "./api/auth/guard/role.guard";
import {AllExceptionsFilter} from "./filters/all-exceptions.filter";

@Module({
  imports: [
    HealthModule,
    MySQLModule,
    AuthModule,
    ClientModule,
    AccountModule,
    DepositModule,
    MoralisModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
