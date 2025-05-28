import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchBookDto {
  @ApiProperty({
    description: 'Search books by author name',
    example: 'F. Scott Fitzgerald',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'Search books by genre',
    example: 'Fiction',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
