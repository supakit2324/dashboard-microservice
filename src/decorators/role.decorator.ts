import { SetMetadata } from '@nestjs/common';
import { RolesUserEnum } from 'src/modules/users/enum/roles-user.enum';

export const UseRoles = (...roles: RolesUserEnum[]) =>
  SetMetadata('roles', roles);
