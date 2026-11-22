import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../src/posts/posts.module';
import { Post } from '../src/posts/post.entity';
import { configureApp } from '../src/configure-app';

describe('Posts API (e2e)', () => {
  let app: INestApplication;
  const body = {
    title: 'My First Blog Post',
    content: 'This is the content of my first blog post.',
    category: 'Technology',
    tags: ['Tech', 'Programming'],
  };

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ type: 'better-sqlite3', database: ':memory:', entities: [Post], synchronize: true }),
        PostsModule,
      ],
    }).compile();
    app = mod.createNestApplication();
    configureApp(app);
    await app.init();
  });
  afterAll(() => app.close());

  it('POST /posts -> 201 with created post', async () => {
    const res = await request(app.getHttpServer()).post('/posts').send(body).expect(201);
    expect(res.body).toMatchObject({ id: 1, ...body });
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });

  it('POST /posts -> 400 on invalid body', async () => {
    const res = await request(app.getHttpServer()).post('/posts').send({ title: '', tags: 'x' }).expect(400);
    expect(res.body.messages.length).toBeGreaterThan(0);
  });

  it('GET /posts/:id -> 200 / 404', async () => {
    await request(app.getHttpServer()).get('/posts/1').expect(200);
    await request(app.getHttpServer()).get('/posts/999').expect(404);
  });

  it('PUT /posts/:id -> 200 updated, 400 invalid, 404 missing', async () => {
    await new Promise((r) => setTimeout(r, 1100));
    const res = await request(app.getHttpServer())
      .put('/posts/1').send({ ...body, title: 'My Updated Blog Post' }).expect(200);
    expect(res.body.title).toBe('My Updated Blog Post');
    expect(res.body.updatedAt).not.toBe(res.body.createdAt);
    await request(app.getHttpServer()).put('/posts/1').send({ title: 'x' }).expect(400);
    await request(app.getHttpServer()).put('/posts/999').send(body).expect(404);
  });

  it('GET /posts?term= filters by title/content/category', async () => {
    await request(app.getHttpServer()).post('/posts')
      .send({ title: 'Cooking pasta', content: 'Boil water', category: 'Food', tags: ['food'] }).expect(201);
    const all = await request(app.getHttpServer()).get('/posts').expect(200);
    expect(all.body).toHaveLength(2);
    const tech = await request(app.getHttpServer()).get('/posts?term=tech').expect(200);
    expect(tech.body).toHaveLength(1);
    const content = await request(app.getHttpServer()).get('/posts?term=boil').expect(200);
    expect(content.body[0].category).toBe('Food');
    const none = await request(app.getHttpServer()).get('/posts?term=zzz').expect(200);
    expect(none.body).toEqual([]);
  });

  it('DELETE /posts/:id -> 204 then 404', async () => {
    await request(app.getHttpServer()).delete('/posts/1').expect(204);
    await request(app.getHttpServer()).delete('/posts/1').expect(404);
    await request(app.getHttpServer()).get('/posts/1').expect(404);
  });
});
