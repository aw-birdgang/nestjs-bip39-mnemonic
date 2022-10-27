import { Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';
import { EthersModule, MATIC_NETWORK } from 'nestjs-ethers';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '../config';
import { CqrsModule } from '@nestjs/cqrs';
import { MoralisController } from './moralis.controller';
import { EthTokenTransfersModule } from 'src/api/eth-token-transfers/eth-token-transfers.module';
import {EthTransactionModule} from "../api/eth-transaction/eth-transaction.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      limit: 5,
      ttl: 60,
      ignoreUserAgents: [/throttler-test/g],
    }),
    ConfigModule,
    EthTokenTransfersModule,
    EthTransactionModule,
    CqrsModule,
  ],
  controllers: [MoralisController],
  providers: [MoralisService],
  exports: [MoralisService],
})
export class MoralisModule {}
