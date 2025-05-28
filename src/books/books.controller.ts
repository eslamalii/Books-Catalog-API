import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { Book } from './schemas/book.schema';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Book created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return paginated books' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10, max: 100)',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.booksService.findAll(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books by author or genre' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return matching books' })
  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
    description: 'Author of the book',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: 'Genre of the book',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10, max: 100)',
  })
  search(@Query() searchBookDto: SearchBookDto) {
    return this.booksService.search(searchBookDto, searchBookDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the book' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Book deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}
