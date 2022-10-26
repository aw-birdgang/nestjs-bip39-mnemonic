import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { Wallet } from './ether-wallet.entity';
import { Account } from './account.entity';
import { EtherWalletAccountService } from './ether-wallet-account.service';
import { EtherWalletService } from './ether-wallet.service';
import { ConfigModule } from 'src/config';
import {EtherWalletController} from "./ether-wallet.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Account]),
    ThrottlerModule.forRoot({
      limit: 5,
      ttl: 60,
      ignoreUserAgents: [/throttler-test/g],
    }),
    ConfigModule,
  ],
  controllers: [EtherWalletController],
  exports: [EtherWalletService, EtherWalletAccountService],
  providers: [EtherWalletService, EtherWalletAccountService],
})
export class EtherWalletModule {}
