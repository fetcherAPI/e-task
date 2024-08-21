import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Status } from '@prisma/client';

interface IFindAll {
  page?: number;
  perPage?: number;
}

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: dto,
    });
  }

  async findAll({ page, perPage }: IFindAll) {
    return paginate(
      this.prisma.task,
      {
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

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async updateTaskStatus(id: string, status: Status) {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: { status },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      console.error(`Error updating task status to ${status}:`, error);
    }
  }
}
