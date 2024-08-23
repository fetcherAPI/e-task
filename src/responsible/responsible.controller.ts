import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('responsilblity')
@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  // @Auth()
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsibleService.create(createResponsibleDto);
  }

  // @Auth()
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  @Roles(1)
  @Get()
  findAll() {
    return this.responsibleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsibleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsibleDto: UpdateResponsibleDto) {
    return this.responsibleService.update(+id, updateResponsibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibleService.remove(+id);
  }
}
