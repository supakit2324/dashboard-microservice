import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordEntyty {
  @ApiProperty({
    example: 'password',
    type: String,
  })
  password: string;

  @ApiProperty({
    example: 'confirmPassword',
    type: String,
  })
  confirmPassword: string;
}
