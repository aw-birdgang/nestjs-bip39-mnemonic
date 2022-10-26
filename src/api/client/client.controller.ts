import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
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
import { RolesGuard } from '../auth/guard/role.guard';
import { ClientService } from './client.service';
import { ClientResponseDto } from './dto/client-response.dto';
import { Roles } from '../../decorator/role.decorator';
import { UserRole } from '../auth/guard/user-role.enum';
import { Client } from './client.entity';

@ApiBearerAuth('JWT')
@Controller('v1/client')
@UseGuards(RolesGuard)
@ApiTags('CLIENT API')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  private readonly logger = new Logger(ClientController.name);

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: '모든 클라이언트 조회 API' })
  @ApiOkResponse({
    description: '모든 클라이언트 를 조회 한다.',
    type: Client,
    isArray: true,
  })
  async findAll(@Res() res: Response) {
    const tokens = await this.clientService.findAll();
    return res.status(HttpStatus.OK).json(tokens);
  }

  @Get(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: '클라이언트 정보 조회 API' })
  @ApiOkResponse({
    description: 'Id가 일치 하는 클라이언트 정보를 조회 한다.',
    type: ClientResponseDto,
  })
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const responseDto = await this.clientService.findById(id);
    return res.status(HttpStatus.OK).json(instanceToPlain(responseDto));
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '클라이언트 삭제 API' })
  @ApiNoContentResponse({
    description: 'Id가 일치 하는 클라이언트 정보를 삭제 한다.',
  })
  async deleteClient(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    await this.clientService.deleteClientById(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
