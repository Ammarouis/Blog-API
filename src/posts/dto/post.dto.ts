import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title should not be empty' })
  title: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content should not be empty' })
  content: string;

  @IsString({ message: 'category must be a string' })
  @IsNotEmpty({ message: 'category should not be empty' })
  category: string;

  @IsArray({ message: 'tags must be an array of strings' })
  @IsString({ each: true, message: 'each tag must be a string' })
  tags: string[];
}
