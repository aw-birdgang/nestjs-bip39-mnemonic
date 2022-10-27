import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MoralisService } from './moralis.service';
import { RolesGuard } from '../api/auth/guard/role.guard';
import { Roles } from '../decorator/role.decorator';
import { UserRole } from '../api/auth/guard/user-role.enum';
import { WatchEthAddressCreateRequestDto } from './dto/watch-eth-address-create-request.dto';

@Controller('v1/moralis')
@UseGuards(RolesGuard)
@ApiTags('MORALIS API')
export class MoralisController {
  constructor(private readonly moralisService: MoralisService) {}

  private readonly logger = new Logger(MoralisController.name);

  @Get('watchEthAddress')
  @ApiOperation({ summary: '조회 API' })
  @ApiOkResponse({
    description: '조회 한다.',
    isArray: true,
  })
  async findAllDepositAddress(@Res() res: Response) {
    const tokens = await this.moralisService.findAllDepositAddress();
    return res.status(HttpStatus.OK).json(tokens);
  }

  @Post('watchEthAddress')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'ETH 주소 등록 API',
    description: 'ETH 주소 등록 을 생성 한다.',
  })
  @ApiCreatedResponse({
    description: 'ETH 주소 등록 을 생성 한다.',
  })
  async create(
    @Body() requestDto: WatchEthAddressCreateRequestDto,
    @Res() res: Response,
  ) {
    const depositAddress = await this.moralisService.registerNewDepositAddress(
      requestDto,
    );
    this.logger.log('create >> depositAddress :: ' + depositAddress.toString());
    return res.status(HttpStatus.CREATED).json(depositAddress);
  }
}
