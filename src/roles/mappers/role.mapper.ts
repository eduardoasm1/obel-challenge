import { Role as PrismaRole } from '@prisma/client';
import type { Role } from '../interfaces/role.interface';

export class RoleMapper {
  static toResponse(raw: PrismaRole): Role {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      type: raw.type ?? undefined,
      scope: raw.scope ?? undefined,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  }

  static toResponseList(raws: PrismaRole[]): Role[] {
    return raws.map(RoleMapper.toResponse);
  }
}
