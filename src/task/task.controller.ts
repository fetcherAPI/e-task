import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Paginate, PaginateOptions } from 'src/shared/decorators/paginate.decorator';
import { Status } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskHistoryService } from 'src/task-history/task-history.service';
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskHistoryService: TaskHistoryService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: true, description: 'Page number' })
  @ApiQuery({ name: 'perPage', required: true, description: 'Items per page' })
  @ApiQuery({ name: 'taskNumber', required: false, description: 'task number' })
  @ApiQuery({ name: 'taskText', required: false, description: 'task text' })
  findAll(
    @Paginate() paginateOptions: PaginateOptions,
    @Query('taskNumber') taskNumber?: string,
    @Query('taskText') taskText?: string,
  ) {
    const { page, perPage } = paginateOptions;

    return this.taskService.findAll({ page, perPage, taskNumber, taskText });
  }

  @Auth()
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    console.log('user', user);
    return this.taskService.findOne(id);
  }

  // @Auth()
  // @ApiBearerAuth()
  @Get('history/:id')
  findTaskHistory(@Param('id') id: string, @User() user) {
    return this.taskHistoryService.findMany(id);
  }

  @Auth()
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user) {
    return this.taskService.update(id, updateTaskDto, user.login);
  }

  @Auth()
  @ApiBearerAuth()
  @Patch('takeConsideration/:id')
  takeConsideration(@Param('id') id: string, @User() user) {
    console.log('user', user);
    return this.taskService.updateTaskStatus(id, Status.IN_PROCCESS, user.login);
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
