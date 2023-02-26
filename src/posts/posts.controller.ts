import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Post as PostModel } from './posts.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Создание новой роли' })
  @ApiResponse({ status: HttpStatus.OK, type: PostModel })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image: any) {
    return this.postService.create(dto, image);
  }
}
