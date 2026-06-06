import type { UserWithRoles } from '../repositories/user.repository';
import type { User } from '../interfaces/user.interface';

export class UserMapper {
  static toResponse(raw: UserWithRoles): User {
    return {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      roleIds: raw.roles.map((r) => r.roleId),
    };
  }
}
