import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountRequestDto {
  @IsNotEmpty({ message: '지갑 아이디(walletId)은 필수 값 입니다.' })
  @ApiProperty({ description: '지갑 아이디' })
  walletId: number;

  @IsNotEmpty({ message: '계정 번호(childNumber)은 필수 값 입니다.' })
  @ApiProperty({ description: '계정 번호' })
  childNumber: number;
}
