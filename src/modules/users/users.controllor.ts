import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userEntyty } from './entities/users.entity';
import ReqUser from 'src/decorators/req-user.decorator';
import { usersInterface } from './interfaces/users.interface';
import { changePasswordDto } from './dto/change-password.dto';
import { ChangePasswordUserValidationPipe } from './pipes/change-password-user-validation.pipe';
import { ChangePasswordEntyty } from './entities/change-password.entity';
import { updateUserDto } from './dto/update-user.dto';
import { updateUserEntyty } from './entities/update-user.entity';
import { rolesUserEnum } from './enum/roles-user.enum';
import { updateRolesDTO } from './dto/update-role.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import UsersQueryEntity from './entities/users-query.entity';
import { UseRoles } from 'src/decorators/role.decorator';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { reportUserEntity } from './entities/report-users.entity';

@Controller('users')
@ApiTags('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  async getMe(@ReqUser() user: usersInterface): Promise<userEntyty> {
    return user;
  }

  @Put('update')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    type: updateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: updateUserEntyty,
  })
  async updateUser(
    @ReqUser() user: usersInterface,
    @Body() update: updateUserDto,
  ): Promise<void> {
    try {
      await this.usersService.updateUser(user.userId, update);
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    type: changePasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ChangePasswordEntyty,
  })
  async changePassword(
    @ReqUser() user: usersInterface,
    @Body(ChangePasswordUserValidationPipe) body: changePasswordDto,
  ): Promise<void> {
    try {
      await this.usersService.changePasswordUser(
        user.userId,
        body.hashPassword,
      );
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('update-role/:userId')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiBody({
    type: updateRolesDTO,
  })
  async updateRole(
    @Payload() update: { userId: string; roles: string },
  ): Promise<void> {
    try {
      await this.usersService.updateRole(update);
    } catch (e) {
      this.logger.error(
        `catch on update-role: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('ban-user/:userId')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async banUser(@Param('userId') userId: string): Promise<void> {
    try {
      const user = await this.usersService.banUser(userId);
      if (!user) {
        throw new BadRequestException('User Id Not found');
      }

      return;
    } catch (e) {
      this.logger.error(
        `catch on ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('un-ban-user/:userId')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async unBanUser(@Param('userId') userId: string): Promise<void> {
    try {
      const user = await this.usersService.unBanUser(userId);
      if (!user) {
        throw new BadRequestException('User Id Not found');
      }
      return;
    } catch (e) {
      this.logger.error(
        `catch on un-ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('pagination')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UsersQueryEntity,
  })
  async getPagination(
    @Query() query: UsersQueryDto,
  ): Promise<UsersQueryEntity> {
    const { username, firstname, lastname } = query;
    const filter = {};

    if (username) {
      filter['username'] = { $regex: `^${username}`, $options: 'i' };
    } else if (firstname) {
      filter['firstname'] = { $regex: `^${firstname}`, $options: 'i' };
    } else if (lastname) {
      filter['lastname'] = { $regex: `^${lastname}`, $options: 'i' };
    }

    query.filter = filter;
    try {
      return this.usersService.getPagination(query);
    } catch (e) {
      this.logger.error(
        `catch on pagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('report-new-user')
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @UseRoles(rolesUserEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: reportUserEntity,
  })
  @ApiBearerAuth()
  async reportNewUser(): Promise<usersInterface> {
    try {
      const newUsers = await this.usersService.findNewUser();
      if (!Array.isArray(newUsers) || newUsers.length === 0) {
        throw new BadRequestException('No new users found');
      }
      return newUsers;
    } catch (e) {
      this.logger.error(
        `catch on report-new-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
