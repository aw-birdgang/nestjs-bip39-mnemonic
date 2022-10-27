import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {isEmpty} from "../../common/util/is-empty";
import Message from "../../common/common.message";
import {EthTransactionEntity} from "./eth-transaction.entity";

@Injectable()
export class EthTransactionService {
    private readonly logger = new Logger(EthTransactionService.name);

    constructor(
        @InjectRepository(EthTransactionEntity)
        private ethTransactionRepository: Repository<EthTransactionEntity>,
    ) {}

    // public async createEthTransaction(
    //     requestDto: EthTokenTransfersCreateRequestDto,
    // ): Promise<EthTokenTransfersEntity> {
    //     const token = this.ethTransactionRepository.create(
    //         EthTransactionEntity.of(requestDto),
    //     );
    //     this.logger.log('ethToken > tokenAddress > ' + token.tokenAddress);
    //     this.logger.log('ethToken > transactionHash > ' + token.transactionHash);
    //     this.logger.log('ethToken > fromAddress > ' + token.fromAddress);
    //     this.logger.log('ethToken > toAddress > ' + token.toAddress);
    //     this.logger.log('ethToken > amount > ' + token.amount);
    //     this.logger.log('ethToken > confirmed > ' + token.confirmed);
    //
    //     return this.ethTransactionRepository.save(token);
    // }

    public async test(data: string) {
        this.logger.log('EthTransactionService > test > ' + data);
    }

    async createEthTransactionEntry(
        entry: EthTransactionEntity,
    ): Promise<EthTransactionEntity> {
        this.logger.log('requestDto > tokenAddress > ' + entry.tokenAddress);
        this.logger.log('requestDto > transactionHash > ' + entry.transactionHash);
        this.logger.log('requestDto > fromAddress > ' + entry.fromAddress);
        this.logger.log('requestDto > toAddress > ' + entry.toAddress);
        this.logger.log('requestDto > value > ' + entry.amount);
        this.logger.log('requestDto > confirmed > ' + entry.confirmed);

        const findEntry = await this.checkFindTokenByTransactionId(
            entry.hash,
        );
        if (isEmpty(findEntry) === false) {
            return this.updateEthTokenTransactionEntry(findEntry.id, entry);
        }
        const token = this.ethTransactionRepository.create(entry);
        return this.ethTransactionRepository.save(token);
    }

    async updateEthTokenTransactionEntry(
        id: number,
        entry: EthTransactionEntity,
    ): Promise<EthTransactionEntity> {
        try {
            const transaction = await this.findTransactionById(id);
            if (isEmpty(transaction) === true) {
                throw new NotFoundException(Message.NOT_FOUND_TRANSACTION);
            }

            const {
                tokenAddress,
                transactionHash,
                toAddress,
                amount,
                logIndex,
                fromAddress,
                confirmed,
            } = entry;
            this.logger.log('update > confirmed : ' + confirmed);
            transaction.update(
                tokenAddress,
                transactionHash,
                toAddress,
                amount,
                logIndex,
                fromAddress,
                confirmed,
            );
            this.ethTransactionRepository.create(transaction);
            return this.ethTransactionRepository.save(transaction);
        } catch (error: any) {
            console.log(error);
            throw new NotFoundException(Message.NOT_FOUND_TRANSACTION);
        }
    }

    async findAll(): Promise<EthTransactionEntity[]> {
        return this.ethTransactionRepository.find();
    }

    async findById(id: number): Promise<EthTransactionEntity> {
        const ethTokenTransfersEntity = await this.findTransactionById(id);
        return ethTokenTransfersEntity;
    }

    /**
     *
     * @param address
     */
    async findByFromAddress(address: string): Promise<EthTransactionEntity[]> {
        const ethTokenTransfersEntities = await this.findTransactionByFromAddress(
            address,
        );
        return ethTokenTransfersEntities;
    }

    async findByToAddress(address: string): Promise<EthTransactionEntity[]> {
        const ethTokenTransfersEntities = await this.findTransactionByToAddress(
            address,
        );
        return ethTokenTransfersEntities;
    }

    private async findTransactionById(id: number): Promise<EthTransactionEntity> {
        const token = await this.ethTransactionRepository.findOne({
            where: { id: id },
        });
        // if (isEmpty(token) === true) {
        //   throw new NotFoundException(Message.NOT_FOUND_TOKEN);
        // }
        return token;
    }

    private async checkFindTokenByTransactionId(
        hash: string,
    ): Promise<EthTransactionEntity> {
        const findOneOptions = {
            where: { hash: hash },
        };
        const find = await this.ethTransactionRepository.findOne(findOneOptions);
        if (isEmpty(find) === true) {
            return null;
        }
        return find;
    }

    private async findTransactionByFromAddress(
        fromAddress: string,
    ): Promise<EthTransactionEntity[]> {
        const findOneOptions = {
            where: { fromAddress: fromAddress },
        };
        const find = await this.ethTransactionRepository.find(findOneOptions);
        if (isEmpty(find) === true) {
            return null;
        }
        return find;
    }

    private async findTransactionByToAddress(
        toAddress: string,
    ): Promise<EthTransactionEntity[]> {
        const findOneOptions = {
            where: { toAddress: toAddress },
        };
        const find = await this.ethTransactionRepository.find(findOneOptions);
        if (isEmpty(find) === true) {
            return null;
        }
        return find;
    }

    /**
     *
     * @param {number} id - 토큰 Id
     * @returns {Promise<void>}
     */
    async deleteTransaction(id: number): Promise<void> {
        await this.ethTransactionRepository.delete(id);
    }
}
