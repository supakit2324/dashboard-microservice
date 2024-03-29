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
import { TopUserBoughtEntity } from './entities/top-users-bought.entity';
import { ReportOrderDTO } from './dto/report-order.dto';
import { OrdersUsersQueryEntity } from './entities/orders-users-query.entity';
import { TopSellerEntity } from './entities/top-seller.entity';
import { TopSellCategoryInterface } from './interfaces/top-sell-category.interface';
import { TopSellCategoryEntity } from './entities/top-sell-category.entity';

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
    type: OrdersUsersQueryEntity,
  })
  async getOrdersUser(
    @Query() query: PageQueryDto,
  ): Promise<OrdersUsersQueryEntity> {
    try {
      return await this.ordersService.getOrdersUsers(query);
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
    type: TopSellerEntity,
  })
  async getTopSeller(): Promise<TopSellerEntity> {
    try {
      return await this.ordersService.getTopSeller();
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
    type: TopSellCategoryEntity,
  })
  async getTopSellerByCategory(): Promise<TopSellCategoryEntity> {
    try {
      return await this.ordersService.getTopSellerByCategory();
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
    type: TopUserBoughtEntity,
    description: 'Success',
  })
  async getTopUserBought(
    @Query() query: PageQueryDto,
  ): Promise<TopUserBoughtEntity> {
    try {
      return await this.ordersService.getTopUserBought(query);
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
    type: ReportOrderDTO,
    description: 'Success',
  })
  async getReport(@Query() query: DayQueryDTO): Promise<ReportOrderDTO> {
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
