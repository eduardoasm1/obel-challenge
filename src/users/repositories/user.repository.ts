import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User as PrismaUser, UserRole } from '@prisma/client';

export type UserWithRoles = PrismaUser & { roles: Pick<UserRole, 'roleId'>[] };

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: { select: { roleId: true } } },
    });
  }

  async findByIdOrThrow(id: string): Promise<UserWithRoles> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User "${id}" not found`);
    return user;
  }

  async findUserRole(userId: string, roleId: string): Promise<UserRole | null> {
    return this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
  }
  // transaction for concurrency, race condition
  async createUserRole(userId: string, roleId: string): Promise<UserWithRoles> {
    return this.prisma.$transaction(async (tx) => {
      await tx.userRole.create({ data: { userId, roleId } });
      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: { roles: { select: { roleId: true } } },
      });
    });
  }

  // transaction for concurrency, race condition
  async deleteUserRole(userId: string, roleId: string): Promise<UserWithRoles> {
    return this.prisma.$transaction(async (tx) => {
      await tx.userRole.delete({
        where: { userId_roleId: { userId, roleId } },
      });
      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: { roles: { select: { roleId: true } } },
      });
    });
  }

  // no transaction needed, just upsert
  async upsert(data: {
    id: string;
    email: string;
    name: string;
  }): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
}
