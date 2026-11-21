import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH ?? 'blog.sqlite',
      entities: [Post],
      synchronize: true, // fine for this project; use migrations in production
    }),
    PostsModule,
  ],
})
export class AppModule {}
