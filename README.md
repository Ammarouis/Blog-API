# Blog API (NestJS + SQLite)

RESTful CRUD API for a personal blogging platform.

## Run
```bash
npm install
npm run build
npm run start:prod      # http://localhost:3000  (PORT and DB_PATH env vars supported)
npm run test:e2e        # end-to-end tests
```

## Endpoints
| Method | Path | Success | Errors |
|---|---|---|---|
| POST | /posts | 201 + post | 400 validation |
| GET | /posts | 200 + array | |
| GET | /posts?term=tech | 200 + filtered array (title, content, category) | |
| GET | /posts/:id | 200 + post | 404 |
| PUT | /posts/:id | 200 + updated post | 400, 404 |
| DELETE | /posts/:id | 204 | 404 |

Body for POST/PUT:
```json
{ "title": "My First Blog Post", "content": "...", "category": "Technology", "tags": ["Tech", "Programming"] }
```

## Structure
- `src/posts/posts.controller.ts` routes and status codes
- `src/posts/posts.service.ts` business logic and search
- `src/posts/post.entity.ts` TypeORM entity (SQLite)
- `src/posts/dto/post.dto.ts` validation rules
