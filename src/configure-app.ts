import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function flatten(errors: ValidationError[]): string[] {
  return errors.flatMap((e) => Object.values(e.constraints ?? {}));
}

export function configureApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          messages: flatten(errors),
        }),
    }),
  );
}
