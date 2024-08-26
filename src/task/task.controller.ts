import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AddNoteDto, UpdateTaskDto } from './dto/update-task.dto';
import {
    Paginate,
    PaginateOptions,
} from 'src/shared/decorators/paginate.decorator';
import { Status } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskHistoryService } from 'src/task-history/task-history.service';
import { TaskNoteService } from 'src/task-note/task-note.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly taskHistoryService: TaskHistoryService,
        private readonly taskNoteService: TaskNoteService,
    ) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }

    @Get()
    @Auth()
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', required: true, description: 'Page number' })
    @ApiQuery({
        name: 'perPage',
        required: true,
        description: 'Items per page',
    })
    @ApiQuery({
        name: 'taskNumber',
        required: false,
        description: 'task number',
    })
    @ApiQuery({ name: 'taskText', required: false, description: 'task text' })
    async findAll(
        @Paginate() paginateOptions: PaginateOptions,
        @User() user,
        @Query('taskNumber') taskNumber?: string,
        @Query('taskText') taskText?: string,
    ) {
        const { page, perPage } = paginateOptions;
        return this.taskService.findAll({
            page,
            perPage,
            taskNumber,
            taskText,
            responsibleId: user?.responsibleId,
        });
    }

    @Auth()
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id') id: string, @User() user) {
        return this.taskService.findOne(id);
    }

    @Auth()
    @ApiBearerAuth()
    @Get('history/:id')
    findTaskHistory(@Param('id') id: string, @User() user) {
        return this.taskHistoryService.findMany(id);
    }

    @Get('notes/:id')
    findTaskNotes(@Param('id') id: string, @User() user) {
        return this.taskNoteService.findMany(id);
    }

    @Auth()
    @ApiBearerAuth()
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @User() user,
    ) {
        return this.taskService.update(
            id,
            updateTaskDto,
            user.login,
            user.fullName,
        );
    }

    @Auth()
    @ApiBearerAuth()
    @Patch('takeConsideration/:id')
    takeConsideration(@Param('id') id: string, @User() user) {
        return this.taskService.updateTaskStatus(
            id,
            Status.IN_PROCCESS,
            user.login,
            user.fullName,
        );
    }

    @Auth()
    @ApiBearerAuth()
    @Patch('sendToConfirm/:id')
    async sendToConfirm(
        @Param('id') id: string,
        @Body() dto: AddNoteDto,
        @User() user,
    ) {
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto?.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.updateTaskStatus(
            id,
            Status.SEND_TO_CONFIRM,
            user?.login,
            user.fullName,
        );

        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @Get('status/:id')
    async getStatus(@Param('id') id: string) {
        const task = await this.taskService.findOne(id);
        return task.status;
    }

    @Auth()
    @ApiBearerAuth()
    @Patch('complete/:id')
    async complete(@Param('id') id: string, @User() user) {
        const task = await this.taskService.updateTaskStatus(
            id,
            Status.DONE,
            user?.login,
            user.fullName,
        );
        this.taskService.update(
            id,
            { endDate: new Date() },
            user.login,
            user.fullName,
        );
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @Patch('rollBack/:id')
    async rollBack(
        @Param('id') id: string,
        @Body() dto: AddNoteDto,
        @User() user,
    ) {
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto?.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.updateTaskStatus(
            id,
            Status.ROLLED_BACK,
            user?.login,
            user.fullName,
        );

        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taskService.remove(+id);
    }
}
