import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Status } from '@prisma/client';
import { TaskHistoryService } from 'src/task-history/task-history.service';

const translates = {
  taskNumber: 'Номер поручения',
  incomingDate: 'Дата поступления',
  taskText: 'Задачи',
  responsibleId: 'Ответственные',
  deadline: 'Срок исполнения',
};

interface IFindAll {
  page?: number;
  perPage?: number;
  taskNumber?: string;
  taskText?: string;
}

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private taskHistoryService: TaskHistoryService,
  ) {}

  private async getPrevStatus(taskId: string) {
    return (await this.prisma.task.findUnique({ where: { id: taskId } }))?.status;
  }

  async create(dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: dto,
    });
  }

  async findAll({ page, perPage, taskNumber, taskText }: IFindAll) {
    return paginate(
      this.prisma.task,
      {
        where: {
          AND: [
            taskNumber ? { taskNumber: { contains: taskNumber } } : {},
            taskText ? { taskText: { contains: taskText } } : {},
          ],
        },
        include: {
          responsible: {
            select: {
              name: true,
            },
          },
        },
      },
      {
        page,
        perPage,
      },
    );
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateTaskDto, changedBy: string) {
    const keys = Object.keys(dto);
    const task = await this.findOne(id);

    this.taskHistoryService.create({
      taskId: id,
      changedAt: new Date(),
      changedBy: changedBy,
      oldStatus: task.status,
      newStatus: task.status,
      details: keys
        .map((el) => {
          return `Поле ${translates[el]} изменен с "${task[el]}" на "${dto[el]}"`;
        })
        .join('*'),
    });

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async updateTaskStatus(id: string, status: Status, changedBy?: string) {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: { status },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      this.taskHistoryService.create({
        taskId: id,
        changedAt: new Date(),
        changedBy: changedBy || '',
        oldStatus: await this.getPrevStatus(id),
        newStatus: status,
      });

      return task;
    } catch (error) {
      console.error(`Error updating task status to ${status}:`, error);
    }
  }
}
