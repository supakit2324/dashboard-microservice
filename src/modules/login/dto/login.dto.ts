import { ApiProperty } from '@nestjs/swagger';

export class AmountLoginDTO {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  amountLogin: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;
}
