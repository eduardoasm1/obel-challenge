import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Full access role' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @ApiPropertyOptional({ example: 'system' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  type?: string;

  @ApiPropertyOptional({ example: 'global' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  scope?: string;
}
