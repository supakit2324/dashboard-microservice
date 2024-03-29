import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AMOUNT_LOGIN_CMD, RMQService } from 'src/constants';
import { lastValueFrom } from 'rxjs';
import { CalendarDTO } from './dto/calendar.dto';

@Injectable()
export class LoginService {
  @Inject(RMQService.USERS) private readonly loginServiceRMQ: ClientProxy;

  async getAmountUsersLogin(query: { date: Date }): Promise<CalendarDTO> {
    return lastValueFrom(
      this.loginServiceRMQ.send(
        {
          cmd: AMOUNT_LOGIN_CMD,
          method: 'get-amount-users-login',
        },
        query,
      ),
    );
  }

  async getLastUsersLogin(query: { date: Date }): Promise<CalendarDTO> {
    return lastValueFrom(
      this.loginServiceRMQ.send(
        {
          cmd: AMOUNT_LOGIN_CMD,
          method: 'get-last-users-login',
        },
        query,
      ),
    );
  }
}
