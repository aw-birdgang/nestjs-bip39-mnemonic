/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../decorator/role.decorator';
import { UserRole } from './user-role.enum';
import { convertToNumber, extractToken } from '../../../common/util/utils';
import { AuthService } from '../auth.service';

const matchRoles = (roles: string[], userRoles: string) => {
  return roles.some((role) => role === userRoles);
};

// Guard는 각 Middleware 이후, Interceptors 또는 Pipes 전에 실행 된다.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean {
    this.logger.debug('canActivate');
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug('requiredRoles : ' + requiredRoles.toString());
    // if (
    //   !requiredRoles
    //     ||
    //   convertToNumber(requiredRoles.toString()) >= UserRole.NONE.valueOf()
    // ) {
    //   this.logger.debug('enough permission for call');
    //   return true;
    // }
    const request = context.switchToHttp().getRequest();
    this.logger.debug(
      'request info : ' +
        JSON.stringify({
          codeline: 'active.guard canActivate',
          ip: request.clientIp,
          timeLabel: new Date().toLocaleDateString(),
        }),
    );
    try {
      const token = extractToken(request.headers.authorization);
      const exist = this.authService.validate(token);
      this.logger.debug(' exist : ' + exist + " , token : " + token);
      if (!token || !exist) {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException(e);
    }
    return true;
  }
}
