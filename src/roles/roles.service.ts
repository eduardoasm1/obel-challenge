import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { RoleMapper } from './mappers/role.mapper';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import type { Role } from './interfaces/role.interface';

const DEFAULT_ROLES = [
  {
    id: 'role-1',
    name: 'admin',
    description: 'Full access role',
    type: 'system',
    scope: 'global',
  },
  {
    id: 'role-2',
    name: 'user',
    description: 'Standard user role',
    type: 'system',
    scope: 'global',
  },
] as const;

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(private readonly roleRepository: RoleRepository) {}

  async onModuleInit(): Promise<void> {
    await Promise.all(DEFAULT_ROLES.map((r) => this.roleRepository.upsert(r)));
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(dto);
    return RoleMapper.toResponse(role);
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();
    return RoleMapper.toResponseList(roles);
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findByIdOrThrow(id);
    return RoleMapper.toResponse(role);
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    const roles = await this.roleRepository.findByIds(ids);
    return RoleMapper.toResponseList(roles);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    await this.roleRepository.findByIdOrThrow(id);
    const role = await this.roleRepository.update(id, dto);
    return RoleMapper.toResponse(role);
  }
}
