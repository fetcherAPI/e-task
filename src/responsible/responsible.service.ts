import { Injectable } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ResponsibleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResponsibleDto) {
    return await this.prisma.responsible.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.responsible.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} responsible`;
  }

  update(id: number, updateResponsibleDto: UpdateResponsibleDto) {
    return `This action updates a #${id} responsible`;
  }

  remove(id: number) {
    return `This action removes a #${id} responsible`;
  }
}
