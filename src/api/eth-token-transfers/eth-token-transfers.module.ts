import { Module } from '@nestjs/common';
import { EthTokenTransfersService } from './eth-token-transfers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EthTokenTransfersController } from './eth-token-transfers.controller';
import { EthTokenTransfersEntity } from './eth-token-transfers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EthTokenTransfersEntity]),
    ThrottlerModule.forRoot({
      limit: 5,
      ttl: 60,
      ignoreUserAgents: [/throttler-test/g],
    }),
  ],
  controllers: [EthTokenTransfersController],
  providers: [EthTokenTransfersService],
  exports: [EthTokenTransfersService],
})
export class EthTokenTransfersModule {}
