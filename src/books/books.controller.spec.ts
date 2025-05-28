import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { PaginationDto } from './dto/pagination-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Test Genre',
    publishedYear: 2023,
    available: true,
  };

  const mockPaginatedResult = {
    data: [mockBook],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        publishedYear: 2023,
        available: true,
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
      };

      mockBooksService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createBookDto)).rejects.toThrow('Database error');
      expect(service.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated books with default pagination', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      mockBooksService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return paginated books with custom pagination', async () => {
      const paginationDto: PaginationDto = { page: 2, limit: 5 };
      const customPaginatedResult = {
        ...mockPaginatedResult,
        page: 2,
        limit: 5,
        totalPages: 1,
      };

      mockBooksService.findAll.mockResolvedValue(customPaginatedResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(customPaginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(bookId);

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith(bookId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      mockBooksService.findOne.mockRejectedValue(
        new NotFoundException(`Book with ID ${bookId} not found`),
      );

      await expect(controller.findOne(bookId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(bookId);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        available: false,
      };
      const updatedBook = { ...mockBook, ...updateBookDto };

      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(bookId, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(bookId, updateBookDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const updateBookDto: UpdateBookDto = { title: 'Updated Title' };

      mockBooksService.update.mockRejectedValue(
        new NotFoundException(`Book with ID ${bookId} not found`),
      );

      await expect(controller.update(bookId, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(bookId, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      mockBooksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(bookId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(bookId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when deleting non-existent book', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      mockBooksService.remove.mockRejectedValue(
        new NotFoundException(`Book with ID ${bookId} not found`),
      );

      await expect(controller.remove(bookId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(bookId);
    });
  });

  describe('search', () => {
    it('should search books by author', async () => {
      const searchBookDto: SearchBookDto = {
        author: 'Test Author',
        page: 1,
        limit: 10,
      };

      mockBooksService.search.mockResolvedValue(mockPaginatedResult);

      const result = await controller.search(searchBookDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.search).toHaveBeenCalledWith(searchBookDto, searchBookDto);
      expect(service.search).toHaveBeenCalledTimes(1);
    });

    it('should search books by genre', async () => {
      const searchBookDto: SearchBookDto = {
        genre: 'Fiction',
        page: 1,
        limit: 10,
      };

      mockBooksService.search.mockResolvedValue(mockPaginatedResult);

      const result = await controller.search(searchBookDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.search).toHaveBeenCalledWith(searchBookDto, searchBookDto);
    });

    it('should search books by both author and genre', async () => {
      const searchBookDto: SearchBookDto = {
        author: 'Test Author',
        genre: 'Fiction',
        page: 1,
        limit: 5,
      };

      const customPaginatedResult = {
        ...mockPaginatedResult,
        limit: 5,
      };

      mockBooksService.search.mockResolvedValue(customPaginatedResult);

      const result = await controller.search(searchBookDto);

      expect(result).toEqual(customPaginatedResult);
      expect(service.search).toHaveBeenCalledWith(searchBookDto, searchBookDto);
    });

    it('should search with default pagination when not provided', async () => {
      const searchBookDto: SearchBookDto = {
        author: 'Test Author',
      };

      mockBooksService.search.mockResolvedValue(mockPaginatedResult);

      const result = await controller.search(searchBookDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.search).toHaveBeenCalledWith(searchBookDto, searchBookDto);
    });

    it('should return empty results when no books match search criteria', async () => {
      const searchBookDto: SearchBookDto = {
        author: 'Non-existent Author',
        page: 1,
        limit: 10,
      };

      const emptyResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockBooksService.search.mockResolvedValue(emptyResult);

      const result = await controller.search(searchBookDto);

      expect(result).toEqual(emptyResult);
      expect(service.search).toHaveBeenCalledWith(searchBookDto, searchBookDto);
    });
  });
});
