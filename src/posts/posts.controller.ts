import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './posts.model';
import { ValidationPipe } from 'pipes/validation.pipe';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Добавление поста' })
  @ApiResponse({ status: HttpStatus.OK, type: PostModel })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @Body(new ValidationPipe()) dto: CreatePostDto,
    @UploadedFile(
      //Todo написать свой валидатор для файлов
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /\w.(jp(g|eg)|png|)/,
        })
        .addMaxSizeValidator({
          maxSize: 250000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.postService.create(dto, image);
  }

  @ApiOperation({ summary: 'Получить все посты' })
  @ApiResponse({ status: HttpStatus.OK, type: [PostModel] })
  @Get()
  getAllPosts() {
    return this.postService.getAll();
  }
}
