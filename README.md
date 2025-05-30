# IBC MCR Accelerator API

This project provides an API for the IBC MCR (Master Control Room) Accelerator, facilitating communication between orchestrators and cloud service vendors in broadcast environments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Development](#development)
  - [Running the Server](#running-the-server)
  - [Database Seeding](#database-seeding)
- [Schema Validation with Zod](#schema-validation-with-zod)
- [Deployment](#deployment)
  - [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The IBC MCR Accelerator API provides a standardized interface for managing broadcast events, sources, destinations, and communication channels in a Master Control Room environment. It enables orchestration of video and audio flows between different components in a broadcast setup.

## Features

- **Event Management**: Create, read, update, and delete broadcast events
- **Source and Destination Management**: Configure video/audio sources and destinations
- **Port Configuration**: Manage input/output ports for sources and destinations
- **Flow Management**: Create connections between source and destination ports
- **Partyline Communication**: Set up communication channels for production teams
- **OpenAPI Documentation**: Auto-generated API documentation with Swagger UI
- **Data Validation**: Robust request validation using Zod schemas

## API Documentation

The API documentation is available at `/docs` when the server is running. For example, if running locally on port 3000, visit:

```
http://localhost:3000/docs
```

## Technology Stack

- **Node.js v22.1.0**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **Prisma**: ORM for database access
- **MySQL**: Database (configurable via Prisma)
- **Zod**: Schema validation and type inference
- **zod-openapi**: OpenAPI documentation generation from Zod schemas
- **Swagger UI**: Interactive API documentation

## Getting Started

### Prerequisites

- Node.js (v22.1.0 or higher)
- NPM 
- MySQL database (or another database supported by Prisma)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ibc
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your database connection string:

```
DATABASE_URL="mysql://username:password@localhost:3306/ibc_db"
```

### Database Setup

1. Generate Prisma client:

```bash
npx prisma generate
```

2. Create and migrate the database:

```bash
npx prisma migrate dev --name init
```

## Development

### Running the Server

Start the development server:

```bash
npm run dev
```

The server will be available at http://localhost:3000 with:
- API endpoints at http://localhost:3000/api/v1
- API documentation at http://localhost:3000/docs

### Database Seeding

Seed the database with sample data:

```bash
npm run prisma:seed
```

Or use the Prisma CLI:

```bash
npx prisma db seed
```

## API Documentation

The API provides endpoints for managing events, sources, destinations, ports, and flow connections. For detailed information about all available endpoints, request/response formats, and examples, please refer to the OpenAPI documentation available at:

```
http://localhost:3000/docs
```

This interactive documentation allows you to:
- Browse all available endpoints
- See request parameters and body schemas
- View response schemas and examples
- Test API calls directly from the browser

## Schema Validation with Zod

This project uses [Zod](https://github.com/colinhacks/zod) for schema validation and type inference. Zod provides several benefits:

1. **Runtime Validation**: Validates incoming request data at runtime
2. **Type Inference**: TypeScript types are inferred from Zod schemas
3. **OpenAPI Integration**: Schemas are used to generate OpenAPI documentation
4. **Consistent Error Handling**: Standardized error responses for validation failures

Example of a Zod schema from the project:

```typescript
// Schema for an event ID
export const eventIdSchema = z.string().uuid().openapi({
  description: "A UUIDv4 identifier for an event",
  example: "83824df7-2831-4ed9-a711-ea1a4bfb4f38",
});

// Schema for a request body
export const eventPutRequestBodySchema = z.object({
  title: titleSchema,
  sources: z.array(sourceSchema).optional(),
  destinations: z.array(destinationSchema).optional(),
});
```

## OpenAPI Documentation

The API documentation is automatically generated from the Zod schemas using [zod-openapi](https://github.com/asteasolutions/zod-to-openapi). This ensures that the documentation is always in sync with the actual implementation.

The OpenAPI document includes:

- Endpoint paths and methods
- Request parameters and body schemas
- Response schemas for different status codes
- Examples and descriptions

## Deployment

### Docker Deployment

The project includes Docker configuration for easy deployment:

1. Build the Docker image:

```bash
npm run docker:build
```

2. Start the Docker containers (API and database):

```bash
npm run docker:up
```

3. Stop the Docker containers:

```bash
npm run docker:down
```

The Docker setup includes:
- API service running on port 3000
- MySQL database with persistent storage
- Automatic database migrations and seeding
- Health checks to ensure services start in the correct order

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
