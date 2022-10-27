import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column()
  @ApiProperty({ description: '지갑 주소' })
  address: string;

  @Column({ unique: true })
  @ApiProperty({ description: '개인 키' })
  privateKey: string;

  @Column({ unique: true })
  @ApiProperty({ description: '공개 키' })
  publicKey: string;

  @Column()
  @ApiProperty({ description: '계정 번호' })
  childNumber: number;

  @Column()
  @ApiProperty({ description: '사용 유무' })
  isUse: number;

  static of(params: Partial<Account>): Account {
    const account = new Account();
    Object.assign(account, params);
    return account;
  }

  updateIsUse(isUse: number): void {
    this.isUse = isUse;
  }
}
