import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// @Index('transactionHash', ['transactionHash'], { unique: true })
@Entity()
export class EthTokenTransfersEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column()
  @ApiProperty({ description: '토큰 주소' })
  tokenAddress: string;

  // @Column('varchar', { name: 'transactionHash', unique: true })
  @Column()
  @ApiProperty({ description: '트랜잭션 해시' })
  transactionHash: string;

  @Column()
  @ApiProperty({ description: '받을 주소' })
  toAddress: string;

  @Column()
  @ApiProperty({ description: '수량' })
  amount: string;

  @Column()
  @ApiProperty({ description: '로그 인덱스' })
  logIndex: number;

  @Column()
  @ApiProperty({ description: '보내는 주소' })
  fromAddress: string;

  @Column()
  @ApiProperty({ description: '확인' })
  confirmed: number;

  static of(params: Partial<EthTokenTransfersEntity>): EthTokenTransfersEntity {
    const ethTokenTransfersEntity = new EthTokenTransfersEntity();
    Object.assign(ethTokenTransfersEntity, params);
    return ethTokenTransfersEntity;
  }

  update(
    tokenAddress: string,
    transactionHash: string,
    toAddress: string,
    amount: string,
    logIndex: number,
    fromAddress: string,
    confirmed: number,
  ): void {
    this.tokenAddress = tokenAddress;
    this.transactionHash = transactionHash;
    this.toAddress = toAddress;
    this.amount = amount;
    this.logIndex = logIndex;
    this.fromAddress = fromAddress;
    this.confirmed = confirmed;
  }
}
