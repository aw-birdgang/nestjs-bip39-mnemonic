import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bip39 from 'bip39';
import Message from '../../common/common.message';
import { hdkey } from 'ethereumjs-wallet';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { isEmpty } from '../../common/util/is-empty';
import {UpdateAccountRequestDto} from "./dto/update-account-request.dto";

@Injectable()
export class AccountService {
  constructor(
      @InjectRepository(Account)
      private accountRepository: Repository<Account>,
  ) {}

  private readonly logger = new Logger(AccountService.name);

  async findAll(): Promise<Account[]> {
    this.logger.debug('AccountService > findAll');
    return this.accountRepository.find();
  }

  async findOneAccountNotUsed(): Promise<Account> {
    return this.findOneAccountByIsUse(0);
  }

  async createAccount(mnemonic: string, childNumber: number): Promise<Account> {
    this.logger.debug('createAccount > mnemonic :: ' + mnemonic);
    const validate = bip39.validateMnemonic(mnemonic);
    if (!validate) {
      this.logger.debug('validate :: ' + validate);
      throw new NotFoundException(Message.INVALID_KEY);
    }

    const seed = await bip39.mnemonicToSeed(mnemonic);
    this.logger.debug('seed :: ' + seed.toString('hex'));
    this.logger.debug('hdkey.name :: ' + hdkey.name);

    // const restoreMnemonic = bip39.entropyToMnemonic(seed);
    // this.logger.debug('restoreMnemonic :: ' + restoreMnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdNode = root.derivePath("m/44'/60'/0'/0").deriveChild(childNumber);

    const hdWallet = hdNode.getWallet();
    this.logger.debug('wallet.getAddress() :: ' + hdWallet.getAddressString());
    this.logger.debug(
        'wallet.getPublicKeyString() :: ' + hdWallet.getPublicKeyString(),
    );
    this.logger.debug(
        'wallet.getPrivateKey() :: ' + hdWallet.getPrivateKeyString(),
    );
    const account = new Account();
    account.childNumber = childNumber;
    account.address = hdWallet.getAddressString();
    account.privateKey = hdWallet.getPrivateKeyString();
    account.publicKey = hdWallet.getPublicKeyString();

    const created = this.accountRepository.create(Account.of(account));
    return this.accountRepository.save(created);
  }

  private async findAccountById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: id },
    });
    if (isEmpty(account) === true) {
      throw new NotFoundException(Message.NOT_FOUND_ACCOUNT);
    }
    return account;
  }

  private async findAccountByAddress(address: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { address: address },
    });
    if (isEmpty(account) === true) {
      throw new NotFoundException(Message.NOT_FOUND_ACCOUNT);
    }
    return account;
  }

  async findLastOneAccount(): Promise<Account> {
    const account = await this.accountRepository.find({
      order: { childNumber: 'DESC' }
    });
    // if (isEmpty(account) === true) {
    //   throw new NotFoundException(Message.NOT_FOUND_ACCOUNT);
    // }
    return account[0];
  }

  private async findOneAccountByIsUse(isUse: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { isUse: isUse },
    });
    if (isEmpty(account) === true) {
      throw new NotFoundException(Message.NOT_FOUND_ACCOUNT);
    }
    return account;
  }

  async updateAccountIsUse(
      id: number,
      requestDto: UpdateAccountRequestDto,
  ): Promise<Account> {
    return this.updateAccountIsUseById(id, requestDto.isUse);
  }

  async updateAccountIsUseById(id: number, isUse: number): Promise<Account> {
    const account = await this.findAccountById(id);
    account.updateIsUse(isUse);
    return this.accountRepository.save(account);
  }

  async updateAccountIsUseByAddress(
      address: string,
      isUse: number,
  ): Promise<Account> {
    const account = await this.findAccountByAddress(address);
    account.updateIsUse(isUse);
    return this.accountRepository.save(account);
  }

  async deleteAccount(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }


}
