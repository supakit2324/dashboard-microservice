import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BooksStockService } from '../books-stock/books-stock.service';
import { RolesUserEnum } from '../users/enum/roles-user.enum';
import { PageQueryDto } from 'src/dto/query.dto';
import { DayQueryDTO } from './dto/day-query.dto';
import { UserOrderUtil } from '../utils/user-order';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from 'src/decorators/role.decorator';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(
    private readonly ordersService: OrdersService,
    private readonly booksStockService: BooksStockService,
  ) {}

  @Get('orders-user')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getOrdersUser(@Query() query: PageQueryDto): Promise<any> {
    try {
      const order = this.ordersService.getOrdersUsers(query);
      return order;
    } catch (e) {
      this.logger.error(
        `catch on get-top-seller: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('top-seller')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getTopSeller(): Promise<any> {
    try {
      const topSellers = await this.ordersService.getTopSeller();
      return topSellers;
    } catch (e) {
      this.logger.error(
        `catch on get-top-seller: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('top-seller-by-category')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getTopSellerByCategory(): Promise<any> {
    try {
      const topSellersCategory =
        await this.ordersService.getTopSellerByCategory();
      return topSellersCategory;
    } catch (e) {
      this.logger.error(
        `catch on get-top-seller: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('top-user-bought')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getTopUserBought(@Query() query: PageQueryDto): Promise<any> {
    try {
      return this.ordersService.getTopUserBought(query);
    } catch (e) {
      this.logger.error(
        `catch on getUsersOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('report')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getReport(@Query() query: DayQueryDTO): Promise<any> {
    try {
      const reportData = await this.ordersService.getReport(query);
      return UserOrderUtil.getDayInput(reportData, query);
    } catch (e) {
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
