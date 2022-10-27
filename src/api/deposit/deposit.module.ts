import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ThrottlerModule} from "@nestjs/throttler";
import {ConfigModule} from "../../config";
import { Deposit } from './deposit.entity';
import {DepositService} from "./deposit.service";
import {DepositController} from "./deposit.controller";
import {AccountModule} from "../account/account.module";
import {MoralisModule, MoralisService} from "../../moralis";

@Module({
    imports: [
        TypeOrmModule.forFeature([Deposit]),
        ThrottlerModule.forRoot({
            limit: 5,
            ttl: 60,
            ignoreUserAgents: [/throttler-test/g],
        }),
        ConfigModule,
        AccountModule,
        MoralisModule
    ],
    controllers: [DepositController],
    providers: [DepositService],
})
export class DepositModule {}
