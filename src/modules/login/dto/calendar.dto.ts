import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CalendarDTO {
  @ApiProperty({
    type: Date,
    example: '2024-03-18',
  })
  @IsOptional()
  @IsNotEmpty()
  date: Date;
}
