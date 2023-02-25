import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  readonly userId: number;
  @ApiProperty({ example: 'Нарушил правило 4.1', description: 'Причина бана' })
  readonly banReason: string;
}
