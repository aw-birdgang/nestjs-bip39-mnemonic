import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Deposit } from '../deposit.entity';

export class UpdateDepositResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _amount: number;
  @Exclude() private readonly _tokenType: string;
  @Exclude() private readonly _depositAddress: string;

  constructor(deposit: Deposit) {
    this._id = deposit.id;
    this._userId = deposit.userId;
    this._amount = deposit.amount;
    this._tokenType = deposit.tokenType;
    this._depositAddress = deposit.depositAddress;
  }

  @ApiProperty({ description: 'ID' })
  @Expose()
  get id(): number {
    return this._id;
  }
  @ApiProperty({ description: '유저 아이디' })
  @Expose()
  get userId(): string {
    return this._userId;
  }
  @ApiProperty({ description: '수량' })
  @Expose()
  get amount(): number {
    return this._amount;
  }
  @ApiProperty({ description: '토큰 타입' })
  @Expose()
  get tokenType(): string {
    return this._tokenType;
  }
  @ApiProperty({ description: '입금 주소' })
  @Expose()
  get depositAddress(): string {
    return this._depositAddress;
  }
}
