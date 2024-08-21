import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateOptions } from 'src/shared/decorators/paginate.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() dto: CreateUserDto) {
    if (dto.roleId == 3 && !dto.responsibleId) {
      throw new HttpException('responsibleId not found', HttpStatus.BAD_REQUEST);
    }
    const { password, ...user } = await this.userService.create(dto);
    return user;
  }

  @Get()
  findAll(@Paginate() paginateOptions: PaginateOptions) {
    const { page, perPage } = paginateOptions;
    return this.userService.findAll({ page, perPage });
  }

  @Patch('active/:id')
  active(@Param('id') id: string) {
    return this.userService.changeUserActivity(id, true);
  }

  @Patch('block/:id')
  block(@Param('id') id: string) {
    return this.userService.changeUserActivity(id, false);
  }
}
