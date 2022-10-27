import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EthTokenTransfersCreateRequestDto {
  @IsNotEmpty({ message: '객체 아이디(blockHash)은 필수 값 입니다.' })
  @IsString({ message: '객체 아이디(blockHash)의 형식이 올 바르지 않습니다.' })
  @ApiProperty()
  blockHash: string;

  @IsNotEmpty({ message: '토큰 주소(tokenAddress)은 필수 값 입니다.' })
  @IsString({ message: '토큰 주소(tokenAddress)의 형식이 올 바르지 않습니다.' })
  @ApiProperty()
  tokenAddress: string;

  @IsNotEmpty({ message: '트랜잭션 해시(transactionHash)은 필수 값 입니다.' })
  @IsString({
    message: '트랜잭션 해시(transactionHash)의 형식이 올 바르지 않습니다.',
  })
  @ApiProperty()
  transactionHash: string;

  @IsNotEmpty({ message: 'toAddress(toAddress)은 필수 값 입니다.' })
  @IsString({ message: 'toAddress(toAddress)의 형식이 올 바르지 않습니다.' })
  @ApiProperty()
  toAddress: string;

  // @IsNotEmpty({ message: '트랜잭션 색인(transactionIndex)은 필수 값 입니다.' })
  // @IsString({
  //   message: '트랜잭션 색인(transactionIndex)의 형식이 올 바르지 않습니다.',
  // })
  // @ApiProperty()
  // transactionIndex: string;

  @IsNotEmpty({ message: '값(value)은 필수 값 입니다.' })
  @IsString({ message: '값(value)의 형식이 올 바르지 않습니다.' })
  @ApiProperty()
  value: string;

  @IsNotEmpty({ message: 'logIndex(logIndex)은 필수 값 입니다.' })
  @ApiProperty()
  logIndex: number;

  // @IsNotEmpty({ message: '블록 넘버(blockNumber)은 필수 값 입니다.' })
  // @ApiProperty()
  // blockNumber: number;

  @IsNotEmpty({ message: 'fromAddress(fromAddress)은 필수 값 입니다.' })
  @IsString({
    message: 'fromAddress(fromAddress)의 형식이 올 바르지 않습니다.',
  })
  @ApiProperty()
  fromAddress: string;

  @IsNotEmpty({ message: 'confirmed(confirmed)은 필수 값 입니다.' })
  @ApiProperty()
  confirmed: number;
}
