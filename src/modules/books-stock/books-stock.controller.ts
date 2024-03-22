import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksStockService } from './books-stock.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookStockDTO } from './dto/create-book-stock.dto';
import { createBooksStockValidationPipe } from './pipe/add-books-stock-validation.pipe';
import { addBooksInStockDto } from './dto/add-book-stock.dto';
import { addBooksStockValidationPipe } from './pipe/update-book-in-stock-validation.pipe';
import { BooksStockInterface } from './interfaces/books-stock.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BooksStockQueryDto } from './dto/books-stock-query.dto';
import BooksStockQueryEntity from './entities/books-stock-query.entity';
import { BooksStockCategoryUtil } from '../utils/books-stock';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from 'src/decorators/role.decorator';
import { rolesUserEnum } from '../users/enum/roles-user.enum';
import { RunningOutQueryDTO } from './dto/running-out-query.dto';
import { RunningOutEntity } from './entities/running-out.entity';

@Controller('books-stock')
@ApiTags('books-stock')
@ApiBearerAuth()
export class BooksStockController {
  private readonly logger = new Logger(BooksStockController.name);

  constructor(private readonly booksStockService: BooksStockService) {}

  @Get('pagination')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BooksStockQueryEntity,
  })
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  async getPagination(
    @Query() query: BooksStockQueryDto,
  ): Promise<BooksStockQueryEntity> {
    const { filter, category, kSort, bookName } = query;

    query.filter = BooksStockCategoryUtil.getQueryByCategory(category);

    query.sort = BooksStockCategoryUtil.sort(kSort);

    if (bookName) {
      filter.bookName = { $regex: `${bookName}` };
    }

    try {
      return this.booksStockService.getPagination(query);
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('get-all-books-in-stock')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  async getAllBooksInStock(): Promise<BooksStockInterface> {
    try {
      return await this.booksStockService.getAllBooksInStock();
    } catch (e) {
      this.logger.error(
        `catch on get-all-books-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Post('create-book-to-stock')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBody({
    type: CreateBookStockDTO,
  })
  async createBookToStock(
    @Body(createBooksStockValidationPipe) body: CreateBookStockDTO,
  ): Promise<void> {
    try {
      await this.booksStockService.createBookToStock(body);
    } catch (e) {
      this.logger.error(
        `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('add-book-in-stock/:bookId')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiParam({
    type: String,
    name: 'bookId',
  })
  @ApiBody({
    type: addBooksInStockDto,
  })
  async addBookInStock(
    @Param('bookId', addBooksStockValidationPipe) addStock: BooksStockInterface,
    @Body() body: addBooksInStockDto,
  ): Promise<void> {
    try {
      await this.booksStockService.addBookToStock(addStock, body.quantity);
    } catch (e) {
      this.logger.error(
        `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('running-out')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Successs',
    type: RunningOutEntity,
  })
  async getRunningOut(
    @Query() query: RunningOutQueryDTO,
  ): Promise<BooksStockInterface> {
    try {
      return await this.booksStockService.runningOut(query);
    } catch (e) {
      this.logger.error(
        `catch on running-out: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Delete('delete-book-in-stock/:bookId')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async deleteBookInStock(
    @Param('bookId') bookId: string,
  ): Promise<BooksStockInterface> {
    try {
      return await this.booksStockService.deleteBookToStock(bookId);
    } catch (e) {
      this.logger.error(
        `catch on delete-book-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
