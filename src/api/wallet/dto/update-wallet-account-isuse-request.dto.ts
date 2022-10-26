import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletAccountIsUseRequestDto {
  @IsInt({ message: '사용 유무(isUse)의 형식이 올 바르지 않습니다.' })
  @ApiProperty({ description: '사용 유무' })
  isUse: number;
}
