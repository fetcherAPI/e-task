import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { Status } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNotEmpty()
  @ApiProperty({ enum: Status })
  status?: Status;

  endDate?: Date;
}

export class AddNoteDto {
  @IsOptional()
  @ApiProperty({ default: 'note to task' })
  note?: Status;
}
