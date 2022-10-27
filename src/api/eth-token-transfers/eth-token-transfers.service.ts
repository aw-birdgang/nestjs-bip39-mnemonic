import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {EthTokenTransfersCreateRequestDto} from './dto/eth-token-transfers-create-request.dto';
import {EthTokenTransfersEntity} from './eth-token-transfers.entity';
import {isEmpty} from "../../common/util/is-empty";
import Message from '../../common/common.message';

@Injectable()
export class EthTokenTransfersService {
  private readonly logger = new Logger(EthTokenTransfersService.name);

  constructor(
    @InjectRepository(EthTokenTransfersEntity)
    private ethTokenTransfersRepository: Repository<EthTokenTransfersEntity>,
  ) {}

  /**
   *
   * @param {EthTokenTransfersCreateRequestDto} requestDto - 이더 토큰 트랜잭션 생성 Dto
   * @returns {Promise<EthTokenTransfersEntity>}
   */
  public async createEthTokenTransaction(
    requestDto: EthTokenTransfersCreateRequestDto,
  ): Promise<EthTokenTransfersEntity> {
    const token = this.ethTokenTransfersRepository.create(
      EthTokenTransfersEntity.of(requestDto),
    );
    this.logger.log('ethToken > tokenAddress > ' + token.tokenAddress);
    this.logger.log('ethToken > transactionHash > ' + token.transactionHash);
    this.logger.log('ethToken > fromAddress > ' + token.fromAddress);
    this.logger.log('ethToken > toAddress > ' + token.toAddress);
    this.logger.log('ethToken > amount > ' + token.amount);
    this.logger.log('ethToken > confirmed > ' + token.confirmed);

    return this.ethTokenTransfersRepository.save(token);
  }

  public async test(data: string) {
    this.logger.log('EthTokenTransfersService > test > ' + data);
  }

  async createEthTokenTransactionEntry(
    entry: EthTokenTransfersEntity,
  ): Promise<EthTokenTransfersEntity> {
    // this.logger.log('requestDto > tokenAddress > ' + entry.tokenAddress);
    // this.logger.log('requestDto > transactionHash > ' + entry.transactionHash);
    // this.logger.log('requestDto > fromAddress > ' + entry.fromAddress);
    // this.logger.log('requestDto > toAddress > ' + entry.toAddress);
    // this.logger.log('requestDto > value > ' + entry.value);
    // this.logger.log('requestDto > confirmed > ' + entry.confirmed);

    const findEntry = await this.checkFindTokenByTransactionId(
      entry.transactionHash,
    );
    if (isEmpty(findEntry) === false) {
      return this.updateEthTokenTransactionEntry(findEntry.id, entry);
    }
    const token = this.ethTokenTransfersRepository.create(entry);
    return this.ethTokenTransfersRepository.save(token);
  }

  async updateEthTokenTransactionEntry(
    id: number,
    entry: EthTokenTransfersEntity,
  ): Promise<EthTokenTransfersEntity> {
    try {
      const transaction = await this.findTransferById(id);
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
      this.ethTokenTransfersRepository.create(transaction);
      return this.ethTokenTransfersRepository.save(transaction);
    } catch (error: any) {
      console.log(error);
      throw new NotFoundException(Message.NOT_FOUND_TRANSACTION);
    }
  }

  /**
   * 모든 토큰 정보를 조회 한다.
   *
   * @returns {Promise<EthTokenTransactionEntity[]>}
   */
  async findAll(): Promise<EthTokenTransfersEntity[]> {
    return this.ethTokenTransfersRepository.find();
  }

  /**
   * 토큰 Id에 해당 하는 토큰 정보를 조회 한다.
   *
   * @param {number} id - 토큰 Id
   * @returns {Promise<TokenResponseDto>}
   */
  async findById(id: number): Promise<EthTokenTransfersEntity> {
    const ethTokenTransfersEntity = await this.findTransferById(id);
    return ethTokenTransfersEntity;
  }

  /**
   *
   * @param address
   */
  async findByFromAddress(address: string): Promise<EthTokenTransfersEntity[]> {
    const ethTokenTransfersEntities = await this.findTransferByFromAddress(
      address,
    );
    return ethTokenTransfersEntities;
  }

  async findByToAddress(address: string): Promise<EthTokenTransfersEntity[]> {
    const ethTokenTransfersEntities = await this.findTransferByToAddress(
      address,
    );
    return ethTokenTransfersEntities;
  }

  /**
   * 토큰 Id에 해당 하는 토큰 정보를 반환 한다.
   *
   * @param {number} id - 토큰 Id
   * @returns {Promise<Token>}
   * @private
   */
  private async findTransferById(id: number): Promise<EthTokenTransfersEntity> {
    const token = await this.ethTokenTransfersRepository.findOne({
      where: { id: id },
    });
    // if (isEmpty(token) === true) {
    //   throw new NotFoundException(Message.NOT_FOUND_TOKEN);
    // }
    return token;
  }

  private async checkFindTokenByTransactionId(
    transactionHash: string,
  ): Promise<EthTokenTransfersEntity> {
    const findOneOptions = {
      where: { transactionHash: transactionHash },
    };
    const find = await this.ethTokenTransfersRepository.findOne(findOneOptions);
    if (isEmpty(find) === true) {
      return null;
    }
    return find;
  }

  private async findTransferByFromAddress(
    fromAddress: string,
  ): Promise<EthTokenTransfersEntity[]> {
    const findOneOptions = {
      where: { fromAddress: fromAddress },
    };
    const find = await this.ethTokenTransfersRepository.find(findOneOptions);
    if (isEmpty(find) === true) {
      return null;
    }
    return find;
  }

  private async findTransferByToAddress(
    toAddress: string,
  ): Promise<EthTokenTransfersEntity[]> {
    const findOneOptions = {
      where: { toAddress: toAddress },
    };
    const find = await this.ethTokenTransfersRepository.find(findOneOptions);
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
    await this.ethTokenTransfersRepository.delete(id);
  }
}
