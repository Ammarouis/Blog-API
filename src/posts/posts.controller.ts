import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: PostDto) {
    return this.posts.create(dto);
  }

  @Get()
  findAll(@Query('term') term?: string) {
    return this.posts.findAll(term);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PostDto) {
    return this.posts.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.posts.remove(id);
  }
}
