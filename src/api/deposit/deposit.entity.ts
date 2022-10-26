import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Deposit {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'id' })
    id: number;

    @Column()
    @ApiProperty({ description: '유저 아이디' })
    userId: string;

    @Column()
    @ApiProperty({ description: '토큰 타입' })
    tokenType: string;

    @Column()
    @ApiProperty({ description: '수량' })
    amount: number;

    @Column()
    @ApiProperty({ description: '입금 주소' })
    depositAddress: string;

    static of(params: Partial<Deposit>): Deposit {
        const deposit = new Deposit();
        Object.assign(deposit, params);
        return deposit;
    }

    update(
        userId: string,
        tokenType: string,
        amount: number,
        depositAddress: string,
    ): void {
        this.userId = userId;
        this.tokenType = tokenType;
        this.amount = amount;
        this.depositAddress = depositAddress;
    }
}
