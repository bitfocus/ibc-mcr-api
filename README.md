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
- [API Endpoints](#api-endpoints)
- [Schema Validation with Zod](#schema-validation-with-zod)
- [OpenAPI Documentation](#openapi-documentation)
- [Deployment](#deployment)
  - [Docker Deployment](#docker-deployment)
  - [Cloud Deployment](#cloud-deployment)
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

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **Prisma**: ORM for database access
- **MySQL**: Database (configurable via Prisma)
- **Zod**: Schema validation and type inference
- **zod-openapi**: OpenAPI documentation generation from Zod schemas
- **Swagger UI**: Interactive API documentation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
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

## API Endpoints

The API provides the following main endpoints:

### Events

- `GET /api/v1/events`: List all events
- `GET /api/v1/events/:eventId`: Get a specific event
- `POST /api/v1/events`: Create a new event
- `PUT /api/v1/events/:eventId`: Update an event
- `PATCH /api/v1/events/:eventId`: Partially update an event
- `DELETE /api/v1/events/:eventId`: Delete an event

### Sources

- `GET /api/v1/sources`: List all sources
- `GET /api/v1/sources/:sourceId`: Get a specific source
- `POST /api/v1/sources`: Create a new source
- `PUT /api/v1/sources/:sourceId`: Update a source
- `DELETE /api/v1/sources/:sourceId`: Delete a source

### Destinations

- `GET /api/v1/destinations`: List all destinations
- `GET /api/v1/destinations/:destinationId`: Get a specific destination
- `POST /api/v1/destinations`: Create a new destination
- `PUT /api/v1/destinations/:destinationId`: Update a destination
- `DELETE /api/v1/destinations/:destinationId`: Delete a destination

### Partylines

- `GET /api/v1/partylines`: List all partylines
- `GET /api/v1/partylines/:partylineId`: Get a specific partyline
- `POST /api/v1/partylines`: Create a new partyline
- `PUT /api/v1/partylines/:partylineId`: Update a partyline
- `DELETE /api/v1/partylines/:partylineId`: Delete a partyline

### Source Ports

- `GET /api/v1/source-ports`: List all source ports
- `GET /api/v1/source-ports/:portId`: Get a specific source port
- `POST /api/v1/source-ports`: Create a new source port
- `PUT /api/v1/source-ports/:portId`: Update a source port
- `DELETE /api/v1/source-ports/:portId`: Delete a source port

### Destination Ports

- `GET /api/v1/destination-ports`: List all destination ports
- `GET /api/v1/destination-ports/:portId`: Get a specific destination port
- `POST /api/v1/destination-ports`: Create a new destination port
- `PUT /api/v1/destination-ports/:portId`: Update a destination port
- `DELETE /api/v1/destination-ports/:portId`: Delete a destination port

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

1. Build the Docker image:

```bash
docker build -t ibc-api .
```

2. Run the container:

```bash
docker run -p 3000:3000 -e DATABASE_URL="mysql://username:password@host:3306/ibc_db" ibc-api
```

### Cloud Deployment

#### AWS Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy to AWS Elastic Beanstalk or AWS ECS.

#### Azure Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy to Azure App Service or Azure Container Instances.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
