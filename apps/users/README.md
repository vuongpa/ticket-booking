# Users Module

This module is built using Domain-Driven Design (DDD) and CQRS patterns in NestJS.

## Architecture

The module follows a clean architecture approach with the following layers:

### Domain Layer
- Contains the core business logic
- Includes entities, value objects, and domain events
- Located in `src/domain`

### Application Layer
- Contains application use cases
- Implements CQRS pattern with commands and queries
- Located in `src/application`

### Infrastructure Layer
- Contains implementations of repositories
- Handles database interactions
- Located in `src/infrastructure`

### Interface Layer
- Contains controllers and DTOs
- Handles HTTP requests and responses
- Located in `src/interface`

## CQRS Implementation

The module uses NestJS CQRS module to separate read and write operations:

### Commands
- `CreateUserCommand`: Creates a new user
- Command handlers process write operations

### Queries
- `GetUserByIdQuery`: Retrieves user by ID
- Query handlers process read operations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB connection in your environment variables.

3. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### POST /users
Creates a new user

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### GET /users/:id
Retrieves a user by ID

Response:
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true
}
``` 