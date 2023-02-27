import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from 'files/files.service';
import { Express } from 'express';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async create(dto: CreatePostDto, image: Express.Multer.File) {
    const fileName = await this.filesService.createFile(image);
    const post = await this.postRepository.create({ ...dto, image: fileName });
    return post;
  }

  async getAll() {
    const posts = await this.postRepository.findAll({ include: { all: true } });
    return posts;
  }
}
