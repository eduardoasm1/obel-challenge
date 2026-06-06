import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Full access role' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'system' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'global' })
  @IsOptional()
  @IsString()
  scope?: string;
}
