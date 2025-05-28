import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: any;

  const mockBook = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Test Genre',
    publishedYear: 2023,
    available: true,
  };

  beforeEach(async () => {
    const mockSave = jest.fn().mockResolvedValue(mockBook);
    
    mockBookModel = jest.fn().mockImplementation(() => ({
      save: mockSave,
    }));
    
    mockBookModel.find = jest.fn();
    mockBookModel.findById = jest.fn();
    mockBookModel.findByIdAndUpdate = jest.fn();
    mockBookModel.findByIdAndDelete = jest.fn();
    mockBookModel.countDocuments = jest.fn();
    mockBookModel.create = jest.fn();
    mockBookModel.exec = jest.fn();
    mockBookModel.skip = jest.fn().mockReturnThis();
    mockBookModel.limit = jest.fn().mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        publishedYear: 2023,
        available: true,
      };

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(mockBookModel).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const mockBooks = [mockBook];
      const total = 1;
      
      mockBookModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBooks),
      });
      
      mockBookModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll({ page: 1, limit: 10 });
      
      expect(result).toEqual({
        data: mockBooks,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, ...updateBookDto };

      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBook),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updateBookDto);
      expect(result).toEqual(updatedBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search books by author and genre', async () => {
      const mockBooks = [mockBook];
      const total = 1;
      
      mockBookModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBooks),
      });
      
      mockBookModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.search(
        { author: 'Test', genre: 'Fiction' },
        { page: 1, limit: 10 }
      );
      
      expect(result).toEqual({
        data: mockBooks,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});
