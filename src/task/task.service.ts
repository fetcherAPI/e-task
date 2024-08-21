import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: dto,
    });
  }

  async findAll() {
    const tasks = await this.prisma.task.findMany({
      include: {
        responsible: true,
      },
    });

    const respose = tasks.map((el) => {
      return { ...el, responsible: el.responsible.name };
    });

    return respose;
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
}
