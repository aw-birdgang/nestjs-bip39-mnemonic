import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterRequestDto } from './dto/auth-register-request.dto';
import { Client } from '../client/client.entity';
import { jwtConstants } from '../../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: ClientService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  validate(token: string): any {
    try {
      this.logger.log('validate > token :: ' + token);
      const verified = this.jwtService.verify(token);
      this.logger.log('verified userId :: ' + verified.userId);
      // this.logger.log('verified username :: ' + verified.username);
      // this.logger.log('verified type :: ' + verified.type);
      return this.userService.checkExistClient(verified.userId, token);
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  // async refreshAccessToken(authorization: string, email: string) {
  //   const secretKey = process.env.JWT_SECRET_KEY
  //     ? process.env.JWT_SECRET_KEY
  //     : 'dev';
  //   const refreshToken = authorization.replace('Bearer ', '');
  //   const verify = this.jwtService.verify(refreshToken, { secret: secretKey });
  //   // refreshToken 만료 안된경우 accessToken 새로 발급
  //   // if (verify) {
  //   //   const client = await this.userService.findOneByEmail(email);
  //   //
  //   //   // db에 저장된 토큰과 비교
  //   //   if (client.token == refreshToken) {
  //   //     const token = this._createToken(client); // accessToken
  //   //     return {
  //   //       token: token,
  //   //       isAuth: true,
  //   //     };
  //   //   }
  //   // }
  //
  //   return {
  //     isAuth: false,
  //   };
  // }

  async validateUser(userId: number): Promise<any> {
    const user = await this.userService.findById(userId);
    const { name, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(requestDto: AuthRegisterRequestDto): Promise<Client> {
    const client = Client.of(requestDto);
    this.logger.debug('register >> client.name :: ' + client.name);
    const created = await this.userService.createClient(client);
    const payload = {
      userId: created.id,
      username: client.name,
      type: client.type,
    };
    const options = { secret: jwtConstants.secret };
    const accessToken = this.jwtService.sign(payload, options);
    this.logger.debug('register >> accessToken :: ' + accessToken);
    created.accessToken = accessToken;
    return this.userService.updateClient(created.id, accessToken);
  }
}
