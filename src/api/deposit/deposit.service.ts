import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Column, Repository} from "typeorm";
import { Deposit } from './deposit.entity';
import {CreateDepositRequestDto} from "./dto/create-deposit-request.dto";
import {isEmpty} from "../../common/util/is-empty";
import Message from "../../common/common.message";
import {UpdateDepositRequestDto} from "./dto/update-deposit-request.dto";
import {EtherWalletService} from "../wallet/ether-wallet.service";
import {EtherWalletAccountService} from "../wallet/ether-wallet-account.service";

@Injectable()
export class DepositService {
    constructor(
        @InjectRepository(Deposit)
        private depositRepository: Repository<Deposit>,
        private readonly etherWalletService: EtherWalletService,
        private readonly etherWalletAccountService: EtherWalletAccountService,
    ) {}

    private readonly logger = new Logger(DepositService.name);

    async createDeposit(requestDto: CreateDepositRequestDto): Promise<Deposit> {
        this.logger.log('createDeposit > requestDto userId :: ' + requestDto.userId);
        this.logger.log(
            'createDeposit > requestDto amount :: ' + requestDto.amount,
        );
        await this.etherWalletService.generateMnemonic();
        // this.etherWalletAccountService.createAccountOnWallet()
        const created = this.depositRepository.create(Deposit.of(requestDto));
        return this.depositRepository.save(created);
    }

    async findDeposits(): Promise<Deposit[]> {
        return this.depositRepository.find();
    }

    async findDepositById(id: number): Promise<Deposit> {
        const deposit = await this.depositRepository.findOne({
            where: { id: id },
        });
        if (isEmpty(deposit) === true) {
            throw new NotFoundException(Message.NOT_FOUND_DEPOSIT);
        }
        return deposit;
    }



    async updateToken(
        id: number,
        requestDto: UpdateDepositRequestDto,
    ): Promise<Deposit> {
        try {
            const deposit = await this.findDepositById(id);
            if (isEmpty(deposit) === true) {
                throw new NotFoundException(Message.NOT_FOUND_DEPOSIT);
            }

            const { userId, tokenType, amount, depositAddress } = requestDto;
            this.logger.log('get > userId : ' + userId);
            this.logger.log('get > tokenType : ' + tokenType);
            this.logger.log('get > amount : ' + amount);
            this.logger.log('get > depositAddress : ' + depositAddress);
            deposit.update(userId, tokenType, amount, depositAddress);
            return this.depositRepository.save(deposit);
        } catch (error: any) {
            console.log(error);
            throw new NotFoundException(Message.NOT_FOUND_DEPOSIT);
        }
    }

    async deleteDeposit(id: number): Promise<void> {
        await this.depositRepository.delete(id);
    }

}
