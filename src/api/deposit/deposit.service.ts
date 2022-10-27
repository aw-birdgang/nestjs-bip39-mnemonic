import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Column, Repository} from "typeorm";
import { Deposit } from './deposit.entity';
import {CreateDepositRequestDto} from "./dto/create-deposit-request.dto";
import {isEmpty} from "../../common/util/is-empty";
import Message from "../../common/common.message";
import {UpdateDepositRequestDto} from "./dto/update-deposit-request.dto";
import {AccountService} from "../account/account.service";
import { ConfigService } from 'src/config';
import {CreateDepositResponseDto} from "./dto/create-deposit-response.dto";
import {MoralisService} from "../../moralis";

@Injectable()
export class DepositService {
    constructor(
        @InjectRepository(Deposit)
        private depositRepository: Repository<Deposit>,
        private readonly configureService: ConfigService,
        private readonly accountService: AccountService,
        private readonly moralisService: MoralisService,
    ) {}

    private readonly logger = new Logger(DepositService.name);

    async createDeposit(requestDto: CreateDepositRequestDto): Promise<CreateDepositResponseDto> {
        this.logger.log('createDeposit > requestDto userId :: ' + requestDto.userId);
        this.logger.log(
            'createDeposit > requestDto amount :: ' + requestDto.amount,
        );

        const deposit = await this.findDepositByUserId(requestDto.userId);
        if (deposit) {
            const depositAddress = deposit.depositAddress;
            this.logger.log('createDeposit > exist > depositAddress :: ' + depositAddress,);
            //
            await this.moralisService.registerWatchEthAddress(depositAddress);

            //
            const newDeposit = new Deposit();
            newDeposit.depositAddress = deposit.depositAddress;
            newDeposit.userId = requestDto.userId;
            newDeposit.amount = requestDto.amount;
            newDeposit.tokenType = requestDto.tokenType;
            const created = this.depositRepository.create(Deposit.of(newDeposit));
            await this.depositRepository.save(created);
            const response = new CreateDepositResponseDto(created);
            return response;
        }
        let childNumber = 0;
        const existAccount = await this.accountService.findLastOneAccount();
        if (existAccount) {
            this.logger.log('createDeposit > existAccount.publicKey :: ' + existAccount.publicKey,);
            this.logger.log('createDeposit > existAccount.childNumber :: ' + existAccount.childNumber,);
            childNumber = existAccount.childNumber + 1;
        } else {
            childNumber = 0;
        }

        const mnemonic = this.configureService.get('MNEMONIC');
        this.logger.log('createDeposit > mnemonic :: ' + mnemonic,);

        const account = await this.accountService.createAccount(mnemonic, childNumber);
        const depositAddress = account.address;
        this.logger.log('createDeposit > account.address :: ' + depositAddress,);
        this.logger.log('createDeposit > account.publicKey :: ' + account.publicKey,);
        this.logger.log('createDeposit > account.privateKey :: ' + account.privateKey,);

        const newDeposit = new Deposit();
        newDeposit.userId = requestDto.userId;
        newDeposit.amount = requestDto.amount;
        newDeposit.tokenType = requestDto.tokenType;
        newDeposit.depositAddress = depositAddress;

        //
        await this.moralisService.registerWatchEthAddress(depositAddress);

        //
        const created = this.depositRepository.create(Deposit.of(newDeposit));
        await this.depositRepository.save(created);
        const response = new CreateDepositResponseDto(created);
        return response;


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


    async findDepositByUserId(userId: string): Promise<Deposit> {
        const deposit = await this.depositRepository.findOne({
            where: { userId: userId },
        });
        // if (isEmpty(deposit) === true) {
        //     throw new NotFoundException(Message.NOT_FOUND_DEPOSIT);
        // }
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
