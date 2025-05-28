# Book Catalog API

A simple RESTful API built with NestJS for managing a catalog of books with MongoDB

## Features

- **CRUD Operations**: Create, Read, Update, Delete books
- **Search Functionality**: Search books by author and genre
- **Pagination**: Paginated responses
- **Validation**: Input validation
- **API Documentation**: Swagger documentation
- **Docker Support**: Containerized application with Docker
- **Testing**: Unit tests

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **Validation**: class-validator
- **Documentation**: Swagger
- **Containerization**: Docker

## Prerequisites

- Node.js
- MongoDB
- Docker

## Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-catalog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run start:dev
   ```

### Docker Development

1. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

This will start both the API and MongoDB in containers

## API Endpoints

### Books

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/books`        | Create a new book            |
| GET    | `/books`        | Get all books (paginated)    |
| GET    | `/books/:id`    | Get a book by ID             |
| PUT    | `/books/:id`    | Update a book                |
| DELETE | `/books/:id`    | Delete a book                |
| GET    | `/books/search` | Search books by author/genre |

### Query Parameters

#### Pagination

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Search

- `author`: Filter by author name
- `genre`: Filter by genre

## 📖 API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:3000/api

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

## Book Schema

```json
{
  "title": "string (required)",
  "author": "string (required)",
  "genre": "string (optional)",
  "publishedYear": "number (optional)",
  "available": "boolean (default: true)"
}
```

## Deployment

### Using Docker

```bash
# Build the image
docker build -t book-catalog-api .

# Run the container
docker run -p 3000:3000 -e MONGODB_URI=your_mongo_uri book-catalog-api
```

### Production Build

```bash
npm run build
npm run start:prod
```

## License

This project is licensed under the MIT License.
