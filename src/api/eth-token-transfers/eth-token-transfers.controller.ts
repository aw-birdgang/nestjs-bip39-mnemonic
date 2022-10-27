import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { EthTokenTransfersService } from './eth-token-transfers.service';
import { EthTokenTransfersEntity } from './eth-token-transfers.entity';
import { instanceToPlain } from 'class-transformer';
import { EthTokenTransfersCreateRequestDto } from './dto/eth-token-transfers-create-request.dto';
import { EthTokenTransfersResponseDto } from './dto/eth-token-transfers-response.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/guard/user-role.enum';
import {Roles} from "../../decorator/role.decorator";

@Controller('v1/ether/transaction/ethTokenTransfers')
@UseGuards(RolesGuard)
@ApiTags('ETHER TOKEN TRANSFERS API')
export class EthTokenTransfersController {
  constructor(
    private readonly ethTokenTransfersService: EthTokenTransfersService,
  ) {}

  private readonly logger = new Logger(EthTokenTransfersController.name);

  @Get()
  @ApiOperation({ summary: '모든 토큰 트랜잭션 조회 API' })
  @ApiOkResponse({
    description: '모든 토큰 트랜잭션 을 조회 한다.',
    type: EthTokenTransfersEntity,
    isArray: true,
  })
  async findAll(@Res() res: Response) {
    const tokens = await this.ethTokenTransfersService.findAll();
    return res.status(HttpStatus.OK).json(tokens);
  }

  // @Post()
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({
  //   summary: '토큰 트랜잭션 생성 API',
  //   description: '토큰 트랜잭션 을 생성 한다.',
  // })
  // @ApiCreatedResponse({
  //   description: '토큰 트랜잭션 을 생성 한다.',
  //   type: EthTokenTransfersEntity,
  // })
  // async create(
  //   @Body() requestDto: EthTokenTransfersCreateRequestDto,
  //   @Res() res: Response,
  // ) {
  //   const ethTokenTransfers =
  //     await this.ethTokenTransfersService.createEthTokenTransaction(requestDto);
  //   this.logger.log(
  //     'create >> ethTokenTransfers :: ' + ethTokenTransfers.toString(),
  //   );
  //   return res.status(HttpStatus.CREATED).json(ethTokenTransfers);
  // }

  @Get(':id')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '트랜잭션 정보 조회 API' })
  @ApiOkResponse({
    description: 'Id가 일치 하는 트랜잭션 정보를 조회 한다.',
    type: EthTokenTransfersResponseDto,
  })
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const responseDto = await this.ethTokenTransfersService.findById(id);
    return res.status(HttpStatus.OK).json(instanceToPlain(responseDto));
  }

  @Get('fromAddress/:fromAddress')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '토큰 트랜잭션 정보 조회 API' })
  @ApiOkResponse({
    description: 'fromAddress 이 일치 하는 토큰 트랜잭션 정보를 조회 한다.',
    type: EthTokenTransfersResponseDto,
  })
  async findOneByFromAddress(
    @Param('fromAddress') fromAddress: string,
    @Res() res: Response,
  ) {
    const responseDto = await this.ethTokenTransfersService.findByFromAddress(
      fromAddress,
    );
    return res.status(HttpStatus.OK).json(instanceToPlain(responseDto));
  }

  @Get('toAddress/:toAddress')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '토큰 트랜잭션 정보 조회 API' })
  @ApiOkResponse({
    description: 'toAddress 이 일치 하는 토큰 트랜잭션 정보를 조회 한다.',
    type: EthTokenTransfersResponseDto,
  })
  async findOneByToAddress(
    @Param('toAddress') toAddress: string,
    @Res() res: Response,
  ) {
    const responseDto = await this.ethTokenTransfersService.findByToAddress(
      toAddress,
    );
    return res.status(HttpStatus.OK).json(instanceToPlain(responseDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: '트랜잭션 삭제 API' })
  @ApiNoContentResponse({
    description: 'Id가 일치 하는 트랜잭션 정보를 삭제 한다.',
  })
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    await this.ethTokenTransfersService.deleteTransaction(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
