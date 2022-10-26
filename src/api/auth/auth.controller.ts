import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Client } from '../client/client.entity';
import { AuthRegisterRequestDto } from './dto/auth-register-request.dto';
import { RolesGuard } from './guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { UserRole } from './guard/user-role.enum';

@ApiBearerAuth('JWT')
@Controller('v1/auth')
@UseGuards(RolesGuard)
@ApiTags('AUTH API')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '인증 생성 API', description: '인증을 생성 한다.' })
  @ApiCreatedResponse({ description: '인증을 생성 한다.', type: Client })
  async register(
    @Body() requestDto: AuthRegisterRequestDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(requestDto);
    return res.status(HttpStatus.CREATED).json(user);
  }
}
