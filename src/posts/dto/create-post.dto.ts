import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'не может быть пустым' })
  readonly title: string;
  @IsNotEmpty({ message: 'не может быть пустым' })
  readonly content: string;
  @IsNotEmpty({ message: 'не может быть пустым' })
  readonly userId: number;
}
