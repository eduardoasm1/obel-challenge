import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role as PrismaRole } from '@prisma/client';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto): Promise<PrismaRole> {
    const role: PrismaRole = await this.prisma.role.create({ data });
    return role;
  }

  async findAll(): Promise<PrismaRole[]> {
    return await this.prisma.role.findMany();
  }

  async findById(id: string): Promise<PrismaRole | null> {
    return this.prisma.role.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<PrismaRole> {
    const role = await this.findById(id);
    if (!role) throw new NotFoundException(`Role "${id}" not found`);
    return role;
  }

  async findByIds(ids: string[]): Promise<PrismaRole[]> {
    return this.prisma.role.findMany({ where: { id: { in: ids } } });
  }

  async update(id: string, data: UpdateRoleDto): Promise<PrismaRole> {
    return this.prisma.role.update({ where: { id }, data });
  }

  async upsert(data: {
    id: string;
    name: string;
    description: string;
    type: string;
    scope: string;
  }): Promise<void> {
    await this.prisma.role.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
}
