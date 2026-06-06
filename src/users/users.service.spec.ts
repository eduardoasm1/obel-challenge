import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findByIdOrThrow: jest.fn(),
    findUserRole: jest.fn(),
    createUserRole: jest.fn(),
    deleteUserRole: jest.fn(),
    upsert: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should assign a role to a user', async () => {
    mockUserRepository.findByIdOrThrow.mockResolvedValue(mockUser);
    mockUserRepository.findUserRole.mockResolvedValue(null);
    mockUserRepository.createUserRole.mockResolvedValue({
      ...mockUser,
      roles: [{ roleId: 'role-1' }],
    });

    const user = await service.assignRole('user-1', 'role-1');

    expect(user.roleIds).toEqual(['role-1']);
    expect(mockUserRepository.createUserRole).toHaveBeenCalledWith(
      'user-1',
      'role-1',
    );
  });

  it('should throw when assigning the same role twice', async () => {
    mockUserRepository.findByIdOrThrow.mockResolvedValue(mockUser);
    mockUserRepository.findUserRole.mockResolvedValue({
      userId: 'user-1',
      roleId: 'role-1',
    });

    await expect(service.assignRole('user-1', 'role-1')).rejects.toThrow(
      ConflictException,
    );
  });

  it('should remove a role assignment from a user', async () => {
    mockUserRepository.findByIdOrThrow.mockResolvedValue(mockUser);
    mockUserRepository.findUserRole.mockResolvedValue({
      userId: 'user-1',
      roleId: 'role-1',
    });
    mockUserRepository.deleteUserRole.mockResolvedValue({
      ...mockUser,
      roles: [],
    });

    const user = await service.removeRole('user-1', 'role-1');

    expect(user.roleIds).toEqual([]);
    expect(mockUserRepository.deleteUserRole).toHaveBeenCalledWith(
      'user-1',
      'role-1',
    );
  });

  it('should throw when removing a role that is not assigned', async () => {
    mockUserRepository.findByIdOrThrow.mockResolvedValue(mockUser);
    mockUserRepository.findUserRole.mockResolvedValue(null);

    await expect(service.removeRole('user-1', 'missing-role')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should list role ids assigned to a user', async () => {
    mockUserRepository.findByIdOrThrow.mockResolvedValue({
      ...mockUser,
      roles: [{ roleId: 'role-1' }, { roleId: 'role-2' }],
    });

    const roleIds = await service.findRoleIds('user-1');

    expect(roleIds).toEqual(['role-1', 'role-2']);
  });

  it('should throw when a user does not exist', async () => {
    mockUserRepository.findByIdOrThrow.mockRejectedValue(
      new NotFoundException(`User "missing-user" not found`),
    );

    await expect(service.findOne('missing-user')).rejects.toThrow(
      NotFoundException,
    );
  });
});
