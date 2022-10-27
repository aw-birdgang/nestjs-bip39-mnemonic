import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ThrottlerModule} from '@nestjs/throttler';
import {Account} from './account.entity';
import {AccountService} from './account.service';
import {ConfigModule} from 'src/config';
import {AccountController} from "./account.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    ThrottlerModule.forRoot({
      limit: 5,
      ttl: 60,
      ignoreUserAgents: [/throttler-test/g],
    }),
    ConfigModule,
  ],
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService],
})
export class AccountModule {}
