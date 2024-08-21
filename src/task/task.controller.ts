import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Paginate, PaginateOptions } from 'src/shared/decorators/paginate.decorator';
import { Status } from '@prisma/client';
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@Paginate() paginateOptions: PaginateOptions) {
    const { page, perPage } = paginateOptions;

    return this.taskService.findAll({ page, perPage });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch('takeConsideration/:id')
  takeConsideration(@Param('id') id: string) {
    return this.taskService.updateTaskStatus(id, Status.IN_PROCCESS);
  }

  @Patch('sendToConfirm/:id')
  sendToConfirm(@Param('id') id: string) {
    return this.taskService.updateTaskStatus(id, Status.SEND_TO_CONFIRM);
  }
  @Patch('complete/:id')
  complete(@Param('id') id: string) {
    return this.taskService.updateTaskStatus(id, Status.DONE);
  }
  @Patch('rollBack/:id')
  rollBack(@Param('id') id: string) {
    return this.taskService.updateTaskStatus(id, Status.ROLLED_BACK);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
