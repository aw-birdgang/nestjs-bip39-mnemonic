import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WatchEthAddressCreateRequestDto {
  @IsNotEmpty({ message: '주소(address)은 필수 값 입니다.' })
  @IsString({ message: '주소(address)의 형식이 올 바르지 않습니다.' })
  @ApiProperty()
  address: string;
}
