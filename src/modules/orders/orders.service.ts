import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_CMD, RMQService } from 'src/constants';
import { lastValueFrom } from 'rxjs';
import { PageQueryDto } from 'src/dto/query.dto';
import { DayQueryDTO } from './dto/day-query.dto';

@Injectable()
export class OrdersService {
  @Inject(RMQService.BOOKS) private readonly ordersServiceRMQ: ClientProxy;

  async getTopSeller(): Promise<any> {
    return lastValueFrom(
      this.ordersServiceRMQ.send(
        {
          cmd: ORDERS_CMD,
          method: 'get-top-seller',
        },
        {},
      ),
    );
  }

  async getTopSellerByCategory(): Promise<any> {
    return lastValueFrom(
      this.ordersServiceRMQ.send(
        {
          cmd: ORDERS_CMD,
          method: 'get-top-seller-by-category',
        },
        {},
      ),
    );
  }

  async getOrdersUsers(query: PageQueryDto): Promise<any> {
    return lastValueFrom(
      this.ordersServiceRMQ.send(
        {
          cmd: ORDERS_CMD,
          method: 'get-order-users',
        },
        query,
      ),
    );
  }

  async getTopUserBought(query: PageQueryDto): Promise<any> {
    return lastValueFrom(
      this.ordersServiceRMQ.send(
        {
          cmd: ORDERS_CMD,
          method: 'get-top-user-bought',
        },
        query,
      ),
    );
  }

  async getReport(query: DayQueryDTO): Promise<any> {
    return lastValueFrom(
      this.ordersServiceRMQ.send(
        {
          cmd: ORDERS_CMD,
          method: 'get-report',
        },
        query,
      ),
    );
  }
}
