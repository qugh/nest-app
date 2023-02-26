import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'constants/user';

export class CreateUserDto {
  @ApiProperty({ example: 'test@mail.ru', description: 'Почта' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
  @ApiProperty({ example: '1234qwer', description: 'Пароль' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Не меньше ${MIN_PASSWORD_LENGTH} и не больше ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly password: string;
}
