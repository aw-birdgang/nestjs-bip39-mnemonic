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
import { RolesGuard } from '../auth/guard/role.guard';
import { Throttle } from '@nestjs/throttler';
import { Account } from './account.entity';
import {AccountService} from "./account.service";
import {UpdateAccountRequestDto} from "./dto/update-account-request.dto";

@ApiBearerAuth('JWT')
@Controller('v1/account')
@UseGuards(RolesGuard)
@Throttle(5, 10)
@ApiTags('ACCOUNT API')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  private readonly logger = new Logger(AccountController.name);


  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: '모든 지갑 계정 조회 API' })
  @ApiOkResponse({
    description: '모든 지갑 계정을 조회 한다.',
    type: Account,
    isArray: true,
  })
  async findAccounts(@Res() res: Response) {
    const accounts = await this.accountService.findAll();
    return res.status(HttpStatus.OK).json(instanceToPlain(accounts));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '계정 정보 수정 API' })
  @ApiOkResponse({
    description: 'Id가 일치 하는 계정을 수정 한다.',
    type: Account,
  })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() requestDto: UpdateAccountRequestDto,
    @Res() res: Response,
  ) {
    const updatedToken = await this.accountService.updateAccountIsUse(
      id,
      requestDto,
    );
    return res.status(HttpStatus.OK).json(updatedToken);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '계정 삭제 API' })
  @ApiNoContentResponse({
    description: 'Id가 일치 하는 계정 정보를 삭제 한다.',
  })
  async deleteAccount(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    await this.accountService.deleteAccount(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
