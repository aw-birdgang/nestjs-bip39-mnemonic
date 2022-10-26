import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Res,
    UseGuards
} from '@nestjs/common';
import {ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {RolesGuard} from "../auth/guard/role.guard";
import {Throttle} from "@nestjs/throttler";
import { DepositService } from './deposit.service';
import {Roles} from "../../decorator/role.decorator";
import {UserRole} from "../auth/guard/user-role.enum";
import {Wallet} from "../wallet/ether-wallet.entity";
import {Response} from "express";
import {instanceToPlain} from "class-transformer";
import { Deposit } from './deposit.entity';
import {CreateDepositRequestDto} from "./dto/create-deposit-request.dto";

@ApiBearerAuth('JWT')
@Controller('v1/deposit')
@UseGuards(RolesGuard)
@Throttle(5, 10)
@ApiTags('DEPOSIT API')
export class DepositController {
    constructor(
        private readonly depositService: DepositService,
    ) {}

    private readonly logger = new Logger(DepositController.name);

    @Get('deposit')
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: '모든 입금 주소 조회 API' })
    @ApiOkResponse({
        description: '모든 입금 주소 한다.',
        type: Deposit,
        isArray: true,
    })
    async findDeposits(@Res() res: Response) {
        const wallets = await this.depositService.findDeposits();
        return res.status(HttpStatus.OK).json(instanceToPlain(wallets));
    }


    @Post('deposit')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: '지갑 생성 API',
        description: '지갑을 생성 합니다.',
    })
    @ApiOkResponse({
        description: '지갑을 생성 합니다.',
        type: Wallet,
    })
    async createDeposit(
        @Body() requestDto: CreateDepositRequestDto,
        @Res() res: Response,
    ) {
        this.logger.log('createDeposit > requestDto userId :: ' + requestDto.userId);
        const wallet = await this.depositService.createDeposit(requestDto);
        return res.status(HttpStatus.CREATED).json(instanceToPlain(wallet));
    }

    // @Put('deposit/:id')
    // @Roles(UserRole.ADMIN)
    // @ApiOperation({ summary: '계정 사용 유무 정보 수정 API' })
    // @ApiOkResponse({
    //     description: 'Id가 일치 하는 계정 사용 유무를 수정 한다.',
    //     type: Account,
    // })
    // async update(
    //     @Param('id', new ParseIntPipe()) id: number,
    //     @Body() requestDto: UpdateWalletAccountIsUseRequestDto,
    //     @Res() res: Response,
    // ) {
    //     const updatedToken = await this.depositService.updateAccountIsUse(
    //         id,
    //         requestDto,
    //     );
    //     return res.status(HttpStatus.OK).json(updatedToken);
    // }

    @Delete('deposit/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: '입금 정보 삭제 API' })
    @ApiNoContentResponse({
        description: 'Id가 일치 하는 입금 정보를 삭제 한다.',
    })
    async deleteWallet(
        @Param('id', new ParseIntPipe()) id: number,
        @Res() res: Response,
    ) {
        await this.depositService.deleteDeposit(id);
        return res.status(HttpStatus.NO_CONTENT).send();
    }

}
