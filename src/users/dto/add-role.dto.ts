import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsIn } from 'class-validator';

export class AddRoleDto {
  @IsEmail({}, { message: 'Введен некорректный email' })
  @ApiProperty({ example: 'test@mail.ru', description: 'Почта' })
  readonly email: string;
  @ApiProperty({ example: 'admin', description: 'Роль' })
  @IsString({ message: 'Роль должна быть строкой' })
  @IsIn(['admin', 'user'], { message: 'Роли не существует' })
  readonly value: string;
}
