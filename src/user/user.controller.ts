import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() dto: CreateUserDto) {
    const { password, ...user } = await this.userService.create(dto);
    return user;
  }
}
