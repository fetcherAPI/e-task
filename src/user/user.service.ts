import { Responsible } from './../responsible/entities/responsible.entity';
import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { UpdateUserDto } from './dto/update-user.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 200 });
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  getByLogin(login: string) {
    return this.prisma.user.findUnique({
      where: {
        login,
      },
    });
  }

  async create(dto: CreateUserDto) {
    const user = {
      fullName: dto.fullName,
      login: dto.login,
      roleId: dto.roleId,
      responsibleId: dto.responsibleId,
      password: await hash(dto.password),
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async changeUserActivity(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { active: isActive },
    });
  }

  async findAll({ perPage, page }: { page: number; perPage }) {
    return paginate(
      this.prisma.user,
      {
        select: {
          id: true,
          roleId: true,
          role: {
            select: {
              name: true,
            },
          },
          login: true,
          fullName: true,
          active: true,
          password: false,
          responsibleId: true,
        },
      },
      {
        page,
        perPage,
      },
    );
  }
}
