import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column()
  @ApiProperty({ description: '니모닉' })
  mnemonic: string;

  @Column()
  @ApiProperty({ description: '이름' })
  name: string;

  static of(params: Partial<Wallet>): Wallet {
    const wallet = new Wallet();
    Object.assign(wallet, params);
    return wallet;
  }
}
