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
    @ApiOperation({ summary: '모든 입금 정보 조회 API' })
    @ApiOkResponse({
        description: '모든 입금 정보 한다.',
        type: Deposit,
        isArray: true,
    })
    async findDeposits(@Res() res: Response) {
        const deposits = await this.depositService.findDeposits();
        return res.status(HttpStatus.OK).json(instanceToPlain(deposits));
    }


    @Post('deposit')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: '입금 정보 생성 API',
        description: '입금 정보를 생성 합니다.',
    })
    @ApiOkResponse({
        description: '입금 정보를 생성 합니다.',
        type: Deposit,
    })
    async createDeposit(
        @Body() requestDto: CreateDepositRequestDto,
        @Res() res: Response,
    ) {
        this.logger.log('createDeposit > requestDto userId :: ' + requestDto.userId);
        const deposit = await this.depositService.createDeposit(requestDto);
        return res.status(HttpStatus.CREATED).json(instanceToPlain(deposit));
    }

    @Delete('deposit/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: '입금 정보 삭제 API' })
    @ApiNoContentResponse({
        description: 'Id가 일치 하는 입금 정보를 삭제 한다.',
    })
    async deleteDeposit(
        @Param('id', new ParseIntPipe()) id: number,
        @Res() res: Response,
    ) {
        await this.depositService.deleteDeposit(id);
        return res.status(HttpStatus.NO_CONTENT).send();
    }

}
