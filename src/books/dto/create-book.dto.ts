import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'To Kill a Mockingbird',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'Harper Lee',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'The genre of the book',
    example: 'Fiction',
    required: false,
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({
    description: 'The year the book was published',
    example: 1960,
    minimum: 1000,
    maximum: new Date().getFullYear(),
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(new Date().getFullYear())
  publishedYear?: number;

  @ApiProperty({
    description: 'Whether the book is available',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean = true;
}
