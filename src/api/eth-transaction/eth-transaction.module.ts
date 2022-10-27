import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ThrottlerModule} from "@nestjs/throttler";
import { EthTransactionEntity } from './eth-transaction.entity';
import { EthTransactionController } from './eth-transaction.controller';
import {EthTransactionService} from "./eth-transaction.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([EthTransactionEntity]),
        ThrottlerModule.forRoot({
            limit: 5,
            ttl: 60,
            ignoreUserAgents: [/throttler-test/g],
        }),
    ],
    controllers: [EthTransactionController],
    providers: [EthTransactionService],
    exports: [EthTransactionService],
})
export class EthTransactionModule {}
