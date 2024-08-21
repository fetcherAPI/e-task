import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ default: 2212334334 })
  @IsNotEmpty()
  taskNumber: string;

  @ApiProperty({ default: 'Название задачи' })
  @IsNotEmpty()
  taskText: string;

  @ApiProperty({ default: '2024-08-20T12:01:27.196Z' })
  @IsNotEmpty()
  incomingDate: Date;

  @ApiProperty({ default: '2024-08-20T12:01:27.196Z' })
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({ default: 'vm22f9i2i000313wgph0febge' })
  @IsNotEmpty()
  responsibleId: string;
}
