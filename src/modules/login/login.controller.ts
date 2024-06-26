import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AmountLoginDTO } from './dto/login.dto';
import { CalendarDTO } from './dto/calendar.dto';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from 'src/decorators/role.decorator';
import { RolesUserEnum } from '../users/enum/roles-user.enum';
import { UserLastLoginResponseEntity } from './entities/user-last-login-respones.entity';

@Controller('amount-login')
@ApiTags('user-login')
@ApiBearerAuth()
export class LogginController {
  private readonly logger = new Logger(LogginController.name);

  constructor(private readonly loginService: LoginService) {}

  @Get('amount-users-login')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    type: AmountLoginDTO,
    status: 200,
    description: 'Success',
  })
  async getAmountUsersLogin(@Query() query: CalendarDTO): Promise<CalendarDTO> {
    const { date } = query;

    try {
      const day = await this.loginService.getAmountUsersLogin(query);
      if (day === null) {
        throw new NotFoundException(`Day ${date} not found`);
      }
      return day;
    } catch (e) {
      this.logger.error(
        `catch on amount-users-login: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('last-users-login')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(RolesUserEnum.ADMIN)
  @ApiResponse({
    type: UserLastLoginResponseEntity,
    status: 200,
    description: 'Success',
  })
  async getLastUserlogin(@Query() query: CalendarDTO): Promise<CalendarDTO> {
    try {
      const lastLogin = await this.loginService.getLastUsersLogin(query);
      return lastLogin;
    } catch (e) {
      this.logger.error(
        `catch on last-users-login: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
