import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class RunningOutQueryDTO {
  @ApiProperty({
    type: Number,
    example: 10,
  })
  @IsOptional()
  min: number;
}
