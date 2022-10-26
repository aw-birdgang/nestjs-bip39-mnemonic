import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from './../account.entity';

export class AccountResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _walletId: number;
  @Exclude() private readonly _address: string;
  @Exclude() private readonly _privateKey: string;
  @Exclude() private readonly _publicKey: string;
  @Exclude() private readonly _childNumber: number;
  @Exclude() private readonly _isUse: number;

  constructor(account: Account) {
    this._id = account.id;
    this._walletId = account.walletId;
    this._address = account.address;
    this._privateKey = account.privateKey;
    this._publicKey = account.publicKey;
    this._childNumber = account.childNumber;
    this._isUse = account.isUse;
  }

  @ApiProperty({ description: 'ID' })
  @Expose()
  get id(): number {
    return this._id;
  }
  @ApiProperty({ description: '지갑 아이디' })
  @Expose()
  get walletId(): number {
    return this._walletId;
  }
  @ApiProperty({ description: '주소' })
  @Expose()
  get address(): string {
    return this._address;
  }
  @ApiProperty({ description: '개인 키' })
  @Expose()
  get privateKey(): string {
    return this._privateKey;
  }
  @ApiProperty({ description: '공개 키' })
  @Expose()
  get publicKey(): string {
    return this._publicKey;
  }
  @ApiProperty({ description: '지갑 계정 번호' })
  @Expose()
  get childNumber(): number {
    return this._childNumber;
  }
  @ApiProperty({ description: '사용 유무' })
  @Expose()
  get isUse(): number {
    return this._isUse;
  }
}
