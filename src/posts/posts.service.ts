import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}

  create(dto: PostDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll(term?: string) {
    const qb = this.repo.createQueryBuilder('post').orderBy('post.id', 'ASC');
    if (term && term.trim()) {
      // escape LIKE wildcards in user input so the search is a plain substring match
      const escaped = term.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
      qb.where(
        `(post.title LIKE :t ESCAPE '\\' OR post.content LIKE :t ESCAPE '\\' OR post.category LIKE :t ESCAPE '\\')`,
        { t: `%${escaped}%` },
      );
    }
    return qb.getMany();
  }

  async findOne(id: number) {
    const post = await this.repo.findOneBy({ id });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }

  async update(id: number, dto: PostDto) {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    post.updatedAt = new Date();
    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.repo.remove(post);
  }
}
