import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({ example: 'test@mail.ru', description: 'Почта' })
  readonly email: string;
  @ApiProperty({ example: 'admin', description: 'Роль' })
  readonly value: string;
}
