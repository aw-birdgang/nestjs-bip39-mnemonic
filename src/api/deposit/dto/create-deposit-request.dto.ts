import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositRequestDto {
    @IsNotEmpty({ message: '유저 아이디(userId)은 필수 값 입니다.' })
    @ApiProperty({ description: '유저 아이디' })
    userId: string;

    @IsNotEmpty({ message: '토큰 타입(tokenType)은 필수 값 입니다.' })
    @ApiProperty({ description: '토큰 타입' })
    tokenType: string;

    @IsNotEmpty({ message: '수량(amount)은 필수 값 입니다.' })
    @ApiProperty({ description: '수량' })
    amount: number;
}
