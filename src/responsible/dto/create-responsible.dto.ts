import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateResponsibleDto {
  @ApiProperty({ default: 'ФКФ' })
  @IsNotEmpty()
  name: string;
}
