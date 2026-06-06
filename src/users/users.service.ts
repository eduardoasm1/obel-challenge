import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';
import type { User } from './interfaces/user.interface';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/interfaces/role.interface';

const DEFAULT_USERS = [
  { id: 'user-1', email: 'john@example.com', name: 'John Doe' },
  { id: 'user-2', email: 'jane@example.com', name: 'Jane Doe' },
] as const;

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RolesService,
  ) {}

  async onModuleInit(): Promise<void> {
    await Promise.all(DEFAULT_USERS.map((u) => this.userRepository.upsert(u)));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findByIdOrThrow(id);
    return UserMapper.toResponse(user);
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    await this.userRepository.findByIdOrThrow(userId);

    await this.roleService.findOne(roleId);

    const existing = await this.userRepository.findUserRole(userId, roleId);
    if (existing) {
      throw new ConflictException(
        `Role "${roleId}" is already assigned to user "${userId}"`,
      );
    }

    const updated = await this.userRepository.createUserRole(userId, roleId);
    return UserMapper.toResponse(updated);
  }

  async removeRole(userId: string, roleId: string): Promise<User> {
    await this.userRepository.findByIdOrThrow(userId);

    const existing = await this.userRepository.findUserRole(userId, roleId);
    if (!existing) {
      throw new NotFoundException(
        `Role "${roleId}" is not assigned to user "${userId}"`,
      );
    }

    const updated = await this.userRepository.deleteUserRole(userId, roleId);
    return UserMapper.toResponse(updated);
  }

  async findRoleIds(userId: string): Promise<Role[]> {
    const userRoleIds = (await this.findOne(userId)).roleIds;
    return Promise.all(userRoleIds.map((id) => this.roleService.findOne(id)));
  }
}
