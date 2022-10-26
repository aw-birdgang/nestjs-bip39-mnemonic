import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletRequestDto {
  @IsNotEmpty({ message: '이름(name)은 필수 값 입니다.' })
  @IsString({ message: '이름(name)의 형식이 올 바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNotEmpty({ message: '니모닉(mnemonic)은 필수 값 입니다.' })
  @IsString({ message: '니모닉(mnemonic)의 형식이 올 바르지 않습니다.' })
  @ApiProperty({ description: '니모닉' })
  mnemonic: string;
}
