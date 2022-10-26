import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Logger,
  Delete,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Roles } from '../../decorator/role.decorator';
import { UserRole } from '../auth/guard/user-role.enum';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { Throttle } from '@nestjs/throttler';
import { Wallet } from './ether-wallet.entity';
import { Account } from './account.entity';
import { CreateWalletRequestDto } from './dto/create-wallet-request.dto';
import { EtherWalletService } from './ether-wallet.service';
import { EtherWalletAccountService } from './ether-wallet-account.service';
import {AccountResponseDto} from "./dto/account-response.dto";
import {UpdateWalletAccountIsUseRequestDto} from "./dto/update-wallet-account-isuse-request.dto";

@ApiBearerAuth('JWT')
@Controller('v1/ether')
@UseGuards(RolesGuard)
@Throttle(5, 10)
@ApiTags('ETHER WALLET API')
export class EtherWalletController {
  constructor(
    private readonly etherService: EtherWalletService,
    private readonly walletService: EtherWalletService,
    private readonly walletAccountService: EtherWalletAccountService,
  ) {}

  private readonly logger = new Logger(EtherWalletController.name);

  @Get('mnemonic')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '니모닉 생성 조회 API' })
  @ApiOkResponse({ description: '니모닉 을 생성 한다.' })
  async generateMnemonic(@Res() res: Response) {
    const mnemonic = await this.etherService.generateMnemonic();
    return res.status(HttpStatus.OK).json(instanceToPlain(mnemonic));
  }

  @Get('wallets')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '모든 지갑 조회 API' })
  @ApiOkResponse({
    description: '모든 지갑을 조회 한다.',
    type: Wallet,
    isArray: true,
  })
  async findAllWallet(@Res() res: Response) {
    const wallets = await this.walletService.findAllWallet();
    return res.status(HttpStatus.OK).json(instanceToPlain(wallets));
  }

  @Get('wallet/:walletId/accounts')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '모든 지갑 계정을 조회 API' })
  @ApiOkResponse({
    description: '모든 지갑 계정을 조회 한다.',
    type: Account,
    isArray: true,
  })
  async findAllWalletAccount(
    @Param('walletId', new ParseIntPipe()) walletId: number,
    @Res() res: Response,
  ) {
    this.logger.debug('findAllWalletAccount > walletId :: ' + walletId);
    const accounts = await this.walletAccountService.findAllWalletAccount(
      walletId,
    );
    return res.status(HttpStatus.OK).json(instanceToPlain(accounts));
  }

  @Get('/wallet/account/enable')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '할당 가능한 지갑 계정 정보 조회 API' })
  @ApiOkResponse({
    description: '할당 가능한 지갑 계정 정보를 조회 한다.',
    type: AccountResponseDto,
  })
  async findOneAccountNotUsed(@Res() res: Response) {
    const responseDto = await this.walletAccountService.findOneAccountNotUsed();
    return res.status(HttpStatus.OK).json(instanceToPlain(responseDto));
  }

  @Post('wallet')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '지갑 생성 API',
    description: '지갑을 생성 합니다.',
  })
  @ApiOkResponse({
    description: '지갑을 생성 합니다.',
    type: Wallet,
  })
  async createWallet(
    @Body() requestDto: CreateWalletRequestDto,
    @Res() res: Response,
  ) {
    this.logger.log('createWallet > requestDto name :: ' + requestDto.name);
    const wallet = await this.walletService.createWallet(requestDto);
    return res.status(HttpStatus.CREATED).json(instanceToPlain(wallet));
  }

  @Post('wallet/account')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '지갑 계정 생성 API',
    description: '지갑에 계정을 생성 합니다.',
  })
  @ApiOkResponse({
    description: '지갑에 계정을 생성 합니다.',
    type: Account,
  })
  async createAccountOnWallet(
    @Body() requestDto: CreateAccountRequestDto,
    @Res() res: Response,
  ) {
    const account = await this.walletAccountService.createAccountOnWallet(
      requestDto,
    );
    return res.status(HttpStatus.OK).json(instanceToPlain(account));
  }

  // @Post('wallet/account/allocate')
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({
  //   summary: '지갑 계정 주소 할당 API',
  //   description: '지갑 계정 주소 할당을 합니다.',
  // })
  // @ApiOkResponse({
  //   description: '지갑 계정 주소 할당을 합니다.',
  //   type: Account,
  // })
  // async allocateAccount(
  //   @Body() requestDto: CreateAccountRequestDto,
  //   @Res() res: Response,
  // ) {
  //   const account = await this.walletAccountService.createAccountOnWallet(
  //     requestDto,
  //   );
  //   return res.status(HttpStatus.OK).json(instanceToPlain(account));
  // }

  @Put('wallet/account/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '계정 사용 유무 정보 수정 API' })
  @ApiOkResponse({
    description: 'Id가 일치 하는 계정 사용 유무를 수정 한다.',
    type: Account,
  })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() requestDto: UpdateWalletAccountIsUseRequestDto,
    @Res() res: Response,
  ) {
    const updatedToken = await this.walletAccountService.updateAccountIsUse(
      id,
      requestDto,
    );
    return res.status(HttpStatus.OK).json(updatedToken);
  }

  @Delete('wallets/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '지갑 삭제 API' })
  @ApiNoContentResponse({
    description: 'Id가 일치 하는 지갑 정보를 삭제 한다.',
  })
  async deleteWallet(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    await this.walletService.deleteWallet(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
