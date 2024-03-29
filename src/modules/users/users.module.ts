import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UsersController } from './users.controllor';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { RMQService } from 'src/constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: RMQService.USERS,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.rmq],
          noAck: true,
          queue: RMQService.USERS,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {}
