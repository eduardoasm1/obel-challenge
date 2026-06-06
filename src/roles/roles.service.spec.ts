import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RoleRepository } from './repositories/role.repository';

describe('RolesService', () => {
  let service: RolesService;

  const mockRoleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdOrThrow: jest.fn(),
    findByIds: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a role', async () => {
    const mockRole = {
      id: 'role-1',
      name: 'Admin',
      description: 'Full access role',
      type: 'system',
      scope: 'global',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRoleRepository.create.mockResolvedValue(mockRole);

    const role = await service.create({
      name: 'Admin',
      description: 'Full access role',
      type: 'system',
      scope: 'global',
    });

    expect(role).toMatchObject({
      name: 'Admin',
      description: 'Full access role',
      type: 'system',
      scope: 'global',
    });
    expect(role.id).toBeDefined();
    expect(role.createdAt).toBeDefined();
    expect(role.updatedAt).toBeDefined();
    expect(mockRoleRepository.create).toHaveBeenCalledWith({
      name: 'Admin',
      description: 'Full access role',
      type: 'system',
      scope: 'global',
    });
  });

  it('should list roles', async () => {
    const mockRoles = [
      {
        id: 'role-1',
        name: 'Viewer',
        description: null,
        type: null,
        scope: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockRoleRepository.findAll.mockResolvedValue(mockRoles);

    const roles = await service.findAll();

    expect(roles).toHaveLength(1);
    expect(roles[0]).toMatchObject({
      name: 'Viewer',
    });
    expect(mockRoleRepository.findAll).toHaveBeenCalled();
  });

  it('should get a role by id', async () => {
    const mockRole = {
      id: 'role-1',
      name: 'Editor',
      description: null,
      type: null,
      scope: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRoleRepository.findByIdOrThrow.mockResolvedValue(mockRole);

    const role = await service.findOne('role-1');

    expect(role).toMatchObject({
      id: 'role-1',
      name: 'Editor',
    });
    expect(mockRoleRepository.findByIdOrThrow).toHaveBeenCalledWith('role-1');
  });

  it('should throw when a role does not exist', async () => {
    mockRoleRepository.findByIdOrThrow.mockRejectedValue(
      new NotFoundException(`Role "missing-role" not found`),
    );

    await expect(service.findOne('missing-role')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a role', async () => {
    const mockRole = {
      id: 'role-1',
      name: 'Content editor',
      description: 'Can edit content',
      type: null,
      scope: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRoleRepository.findByIdOrThrow.mockResolvedValue(mockRole);
    mockRoleRepository.update.mockResolvedValue(mockRole);

    const updatedRole = await service.update('role-1', {
      name: 'Content editor',
      description: 'Can edit content',
    });

    expect(updatedRole).toMatchObject({
      id: 'role-1',
      name: 'Content editor',
      description: 'Can edit content',
    });
    expect(mockRoleRepository.update).toHaveBeenCalledWith('role-1', {
      name: 'Content editor',
      description: 'Can edit content',
    });
  });

  it('should find roles by ids', async () => {
    const mockRoles = [
      {
        id: 'role-1',
        name: 'Admin',
        description: null,
        type: null,
        scope: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'role-2',
        name: 'User',
        description: null,
        type: null,
        scope: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockRoleRepository.findByIds.mockResolvedValue(mockRoles);

    const roles = await service.findByIds(['role-1', 'role-2']);

    expect(roles).toHaveLength(2);
    expect(mockRoleRepository.findByIds).toHaveBeenCalledWith([
      'role-1',
      'role-2',
    ]);
  });
});
