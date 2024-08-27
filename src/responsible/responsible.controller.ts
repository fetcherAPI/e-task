import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleEnum } from 'src/enums/role.enum';

@ApiTags('responsilblity')
@Controller('responsible')
export class ResponsibleController {
    constructor(private readonly responsibleService: ResponsibleService) {}

    @Auth()
    @ApiBearerAuth()
    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createResponsibleDto: CreateResponsibleDto) {
        return this.responsibleService.create(createResponsibleDto);
    }

    @Auth()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin, RoleEnum.Creator, RoleEnum.SuperUser)
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
