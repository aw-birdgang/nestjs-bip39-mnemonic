import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { ClientModule } from '../client/client.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client/client.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PublicStrategy } from './strategy/public.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    forwardRef(() => ClientModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Client]),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    ThrottlerModule.forRoot({
      limit: 5,
      ttl: 60,
      ignoreUserAgents: [/throttler-test/g],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
