import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bip39 from 'bip39';
import Message from '../../common/common.message';
import { Wallet } from './ether-wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateWalletRequestDto} from "./dto/create-wallet-request.dto";
import {isEmpty} from "../../common/util/is-empty";

@Injectable()
export class EtherWalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  private readonly logger = new Logger(EtherWalletService.name);

  async generateMnemonic() {
    const mnemonic: string = bip39.generateMnemonic();
    this.logger.debug('mnemonic :: ' + mnemonic);
    const validate = bip39.validateMnemonic(mnemonic);
    await bip39.mnemonicToSeed(mnemonic);
    this.logger.debug('validate :: ' + validate);
    return mnemonic;
  }

  async findAllWallet(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async createWallet(requestDto: CreateWalletRequestDto): Promise<Wallet> {
    this.logger.log('createWallet > requestDto name :: ' + requestDto.name);
    this.logger.log(
      'createWallet > requestDto mnemonic :: ' + requestDto.mnemonic,
    );
    const created = this.walletRepository.create(Wallet.of(requestDto));
    return this.walletRepository.save(created);
  }

  async findWalletById(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: id },
    });
    if (isEmpty(wallet) === true) {
      throw new NotFoundException(Message.NOT_FOUND_CLIENT);
    }
    return wallet;
  }

  async deleteWallet(id: number): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
