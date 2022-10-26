import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterRequestDto {
  @IsNotEmpty({ message: '이름(name)은 필수 값 입니다.' })
  @IsString({ message: '이름(name)의 형식이 올 바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNotEmpty({ message: '형태(type)은 필수 값 입니다.' })
  @IsString({ message: '형태(type)의 형식이 올 바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '형태' })
  type: string;
}
