import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { TaskHistoryService } from 'src/task-history/task-history.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TaskHistoryService],
})
export class TaskModule {}
