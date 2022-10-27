import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {EthTransactionEntity} from "../eth-transaction.entity";

export class EthTransactionResponseDto {
  @Exclude() private readonly _tokenAddress: string;
  @Exclude() private readonly _transactionHash: string;
  @Exclude() private readonly _toAddress: string;
  @Exclude() private readonly _amount: string;
  @Exclude() private readonly _logIndex: number;
  @Exclude() private readonly _fromAddress: string;
  @Exclude() private readonly _confirmed: number;

  constructor(transaction: EthTransactionEntity) {
    this._tokenAddress = transaction.tokenAddress;
    this._transactionHash = transaction.transactionHash;
    this._toAddress = transaction.toAddress;
    this._amount = transaction.amount;
    this._logIndex = transaction.logIndex;
    this._fromAddress = transaction.fromAddress;
    this._confirmed = transaction.confirmed;
  }

  @ApiProperty({ description: '토큰 주소' })
  @Expose()
  get tokenAddress(): string {
    return this._tokenAddress;
  }

  @ApiProperty({ description: '트랜잭션 해시' })
  @Expose()
  get transactionHash(): string {
    return this._transactionHash;
  }
  @ApiProperty({ description: '보낸 주소' })
  @Expose()
  get toAddress(): string {
    return this._toAddress;
  }
  @ApiProperty({ description: '수량' })
  @Expose()
  get amount(): string {
    return this._amount;
  }
  @ApiProperty({ description: '로그 인덱스' })
  @Expose()
  get logIndex(): number {
    return this._logIndex;
  }
  @ApiProperty({ description: '노출 여부' })
  @Expose()
  get fromAddress(): string {
    return this._fromAddress;
  }
  @ApiProperty({ description: '확인 유무' })
  @Expose()
  get confirmed(): number {
    return this._confirmed;
  }
}
