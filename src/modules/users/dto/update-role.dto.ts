import { ApiProperty } from '@nestjs/swagger';
import { rolesUserEnum } from '../enum/roles-user.enum';

export class updateRolesDTO {
  @ApiProperty({
    type: String,
    example: 'userId',
    required: true,
  })
  userId: string;

  @ApiProperty({
    type: String,
    enum: rolesUserEnum,
    example: rolesUserEnum.USER,
  })
  roles?: string;
}
