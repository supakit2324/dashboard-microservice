import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DayQueryDTO {
  @ApiPropertyOptional({
    description: 'startDay',
  })
  @ApiProperty({
    example: '2024-03-15',
  })
  @IsOptional()
  startDay: Date;

  @ApiPropertyOptional({
    description: 'endDay',
  })
  @ApiProperty({
    example: '2024-03-15',
  })
  @IsOptional()
  endDay: Date;
}
