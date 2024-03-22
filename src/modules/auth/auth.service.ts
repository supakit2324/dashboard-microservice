import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQService, USER_CMD } from 'src/constants';
import { loginUserDto } from './dto/user-login.dto';
import { lastValueFrom } from 'rxjs';
import { usersInterface } from '../users/interfaces/users.interface';
import { UsersLoginEntity } from './entities/user-login-entity';

@Injectable()
export class AuthService {
  @Inject(RMQService.USERS) private readonly usersServiceQmq: ClientProxy;

  async loginUser(email: string, password: string): Promise<UsersLoginEntity> {
    const body: loginUserDto = { email, password };
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'login',
        },
        body,
      ),
    );
  }

  async getByUserId(userId: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'getByUserId',
        },
        userId,
      ),
    );
  }

  async getByEmail(email: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'getByEmail',
        },
        email,
      ),
    );
  }

  async getByUsername(username: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'getByUsername',
        },
        username,
      ),
    );
  }

  async getBlockUser(email: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'getBlockUser',
        },
        email,
      ),
    );
  }

  async getAdminRole(email: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceQmq.send(
        {
          cmd: USER_CMD,
          method: 'get-admin-role',
        },
        email,
      ),
    );
  }
}