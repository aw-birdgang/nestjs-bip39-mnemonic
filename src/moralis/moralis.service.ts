import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import MoralisNode from 'moralis-v1/node';
const MoralisNode = require("moralis-v1/node");

import { ConfigService } from '../config';
import { ERC20_BGT_DECIMALS } from '../common/constants';
import { WatchEthAddressCreateRequestDto } from './dto/watch-eth-address-create-request.dto';
import { ADDRESS_SYNC_STATUS, ETH_TRANSACTIONS } from './common/constants';
import { EthTokenTransfersService } from 'src/api/eth-token-transfers/eth-token-transfers.service';
import {EthTokenTransfersEntity} from "../api/eth-token-transfers/eth-token-transfers.entity";
import { EthTransactionService } from 'src/api/eth-transaction/eth-transaction.service';
import { EthTransactionEntity } from 'src/api/eth-transaction/eth-transaction.entity';

@Injectable()
export class MoralisService implements OnModuleInit {
  private readonly logger = new Logger(MoralisService.name);

  constructor(
    private readonly configureService: ConfigService,
    private readonly ethTransactionService: EthTransactionService,
    private readonly ethTokenTransfersService: EthTokenTransfersService,
  ) {
    this.logger.log('MoralisService constructor ');
  }

  async test(): Promise<void> {
    await this.ethTokenTransfersService.test('test');
    this.logger.log('MoralisService test ');
  }

  async registerNewDepositAddress(
    requestDto: WatchEthAddressCreateRequestDto,
  ): Promise<any> {
    return await this.registerWatchEthAddress(requestDto.address);
  }

  async findAllDepositAddress() {
    const query = new MoralisNode.Query(ADDRESS_SYNC_STATUS);
    const results = await query.find();
    this.logger.log('MoralisService setup > results :: ' + results);
    return results;
  }

  async onModuleInit(): Promise<void> {
    await this.setup();
  }

  async setup() {
    this.logger.log('MoralisService setup ');
    await this.init();
    await this.registerEthDepositAddress();
    await this.registerGpxDepositAddress();

    // await this.registerNewDepositAddress(
    //   '0x6A1375E47E402cd71EB5C7Db807c152886fe9045',
    // );
  }

  private async init() {
    const moralisServerUrl = this.configureService.get('MORALIS_SERVER_URL');
    const moralisAppId = this.configureService.get('MORALIS_APP_ID');
    const moralisMasterKey = this.configureService.get('MORALIS_MASTER_KEY');
    this.logger.log(
      'init() :: moralisServerUrl : ' +
        moralisServerUrl +
        ' , moralisAppId : ' +
        moralisAppId +
        ' , moralisMasterKey : ' +
        moralisMasterKey,
    );
    await MoralisNode.start({
      serverUrl: moralisServerUrl,
      appId: moralisAppId,
      masterKey: moralisMasterKey,
    });
  }

  private async syncDepositAddresses() {
    // MoralisNode.Cloud.define('devSync', async (request) => {
    // });
    try {
      const data = ['0x6A1375E47E402cd71EB5C7Db807c152886fe9045'];

      for (const address of data) {
        const query = new MoralisNode.Query('_AddressSyncStatus');
        query.equalTo('address', address);
        const object = await query.first({ useMasterKey: true });
        if (object) {
          this.logger.log('감시 목록애 이미 존재...', object);
        } else {
          this.logger.log('감시 목록에 추가 하기...', address);
        }
        await MoralisNode.Cloud.run(
          'watchEthAddress',
          {
            address: address,
          },
          { useMasterKey: true },
        );
      }
    } catch (error) {
      this.logger.error('error: ' + error);
      return error;
    }
  }

  async registerWatchEthAddress(address: string) {
    try {
      const result = await MoralisNode.Cloud.run(
        'watchEthAddress',
        {
          address: address,
        },
        { useMasterKey: true },
      );
      this.logger.log('새로운 입금 주소 추가.', result);
      return result;
    } catch (error) {
      this.logger.error('error: ' + error);
      return error;
    }
  }

  private async registerEthDepositAddress() {
    const boundFunction = async function (data: any) {
      this.logger.log('registerEthDepositAddress boundFunction', data);
      await this.ethTransactionService.test('update');
      const hash = data.get('hash');
      const from_address = data.get('from_address');
      const to_address = data.get('to_address');
      const value = data.get('value');
      const decimal = data.get('decimal');
      const block_number = data.get('block_number');
      const confirmed = data.get('confirmed') ?? false;
      const logIndex = data.get('log_index');

      this.logger.log(`hash : ${hash}`);
      this.logger.log(`from_address : ${from_address}`);
      this.logger.log(`to_address : ${to_address}`);
      this.logger.log(`decimal : ${decimal}`);
      this.logger.log(`confirmed : ${confirmed}`);
      const amountToken = MoralisNode.Units.FromWei(value, ERC20_BGT_DECIMALS);
      this.logger.log(
          `registerGpxDepositAddress update : ${amountToken} deposited to Deposit Wallet`,
      );
      this.logger.log(`block_number : ${block_number}`);
      this.logger.log(`logIndex : ${logIndex}`);

      const ethTransactionEntity = new EthTransactionEntity();
      ethTransactionEntity.hash = hash;
      ethTransactionEntity.fromAddress = from_address;
      ethTransactionEntity.toAddress = to_address;
      ethTransactionEntity.amount = value;
      ethTransactionEntity.logIndex = logIndex;
      ethTransactionEntity.confirmed = confirmed ? 1 : 0;

      if (confirmed) {
        this.logger.debug(`registerEthDepositAddress > confirmed : ${confirmed}`);
      }
      return await this.ethTransactionService.createEthTransactionEntry(
          ethTransactionEntity,
      );
    }.bind(this);

    const query = new MoralisNode.Query(ETH_TRANSACTIONS);
    const subscribe = await query.subscribe();
    subscribe.on('create', async function (data) {
      Logger.log('registerEthDepositAddress created event fetched...', data);
    });
    subscribe.on('open', async () => {
      Logger.log('registerEthDepositAddress subscription open!');
    });
    subscribe.on('update', boundFunction);
    subscribe.on('close', async () => {
      Logger.log('registerEthDepositAddress subscription closed');
    });
  }

  private async registerGpxDepositAddress() {
    const boundFunction = async function (data: any) {
      this.logger.log('registerGpxDepositAddress boundFunction', data);
      await this.ethTokenTransfersService.test('update');
      const token_address = data.get('token_address');
      const transaction_hash = data.get('transaction_hash');
      const from_address = data.get('from_address');
      const to_address = data.get('to_address');
      const value = data.get('value');
      const block_number = data.get('block_number');
      const confirmed = data.get('confirmed') ?? false;
      const logIndex = data.get('log_index');

      this.logger.log(`token_address : ${token_address}`);
      this.logger.log(`transaction_hash : ${transaction_hash}`);
      this.logger.log(`from_address : ${from_address}`);
      this.logger.log(`to_address : ${to_address}`);
      this.logger.log(`confirmed : ${confirmed}`);
      const amountToken = MoralisNode.Units.FromWei(value, ERC20_BGT_DECIMALS);
      this.logger.log(
        `registerGpxDepositAddress update : ${amountToken} deposited to Deposit Wallet`,
      );
      this.logger.log(`block_number : ${block_number}`);
      this.logger.log(`logIndex : ${logIndex}`);

      const ethTokenTransfersEntity = new EthTokenTransfersEntity();
      ethTokenTransfersEntity.tokenAddress = token_address;
      ethTokenTransfersEntity.transactionHash = transaction_hash;
      ethTokenTransfersEntity.fromAddress = from_address;
      ethTokenTransfersEntity.toAddress = to_address;
      ethTokenTransfersEntity.amount = value;
      ethTokenTransfersEntity.logIndex = logIndex;
      ethTokenTransfersEntity.confirmed = confirmed ? 1 : 0;

      return await this.ethTokenTransfersService.createEthTokenTransactionEntry(
        ethTokenTransfersEntity,
      );
    }.bind(this);

    const query = new MoralisNode.Query('EthTokenTransfers');
    const subscribe = await query.subscribe();
    subscribe.on('create', async function (data) {
      this.logger.log('registerGpxDepositAddress created fetched...', data);
      await this.ethTokenTransfersService.test('create');
    });
    subscribe.on('open', async () => {
      this.logger.log('registerGpxDepositAddress subscription open!');
      await this.ethTokenTransfersService.test('open');
    });

    subscribe.on('update', boundFunction);
    subscribe.on('close', async () => {
      this.logger.log('registerGpxDepositAddress subscription closed');
    });
  }
}
