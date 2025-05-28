import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
  Router,
} from "express";
import { type z, type ZodSchema, ZodError, type AnyZodObject } from "zod";

// Augment Express's Request type to include our validated data fields
declare global {
  namespace Express {
    interface Request {
      validatedParams: Record<string, unknown>;
      validatedQuery: Record<string, unknown>;
      validatedBody: Record<string, unknown>;
    }
  }
}

// A more strongly-typed Request for use in our handlers
export interface TypedValidatedRequest<P, Q, B> extends Request {
  validatedParams: P extends Record<string, unknown> ? P : Record<string, unknown>; // P will be inferred from Zod schema for params
  validatedQuery: Q extends Record<string, unknown> ? Q : Record<string, unknown>; // Q will be inferred from Zod schema for query
  validatedBody: B extends Record<string, unknown> ? B : Record<string, unknown>; // B will be inferred from Zod schema for body
}

// Schemas for the validation middleware
export interface ValidationSchemas {
  params?: AnyZodObject;
  query?: AnyZodObject;
  body?: AnyZodObject;
}

// General-purpose validation middleware factory
export function validateRequest(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        // Express query params can be strings or arrays of strings.
        // Zod's .parse() will handle coercion based on your schema (e.g. z.number(), z.boolean())
        req.validatedQuery = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        // This assumes app.use(express.json()) has already parsed the body
        req.validatedBody = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        });
        return;
      }
      // For other unexpected errors, pass to Express's default error handler
      next(error);
    }
  };
}

// Interface for defining a single route configuration
// Generic types Pz, Qz, Bz are Zod schemas; Pr, Qr, Br are inferred types for handler
export interface RouteConfig<
  Pz extends AnyZodObject | undefined = undefined, // Zod schema for path params
  Qz extends AnyZodObject | undefined = undefined, // Zod schema for query params
  Bz extends AnyZodObject | undefined = undefined, // Zod schema for request body
> {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string; // Express-style path (e.g., /users/:id)
  openapi: {
    // Structure for zod-openapi path item method
    summary?: string;
    description?: string;
    tags?: string[];
    requestParams?: {
      // For path, query, header parameters
      path?: Pz;
      query?: Qz;
      // header?: Hz; // Can be extended for header schemas
    };
    requestBody?: {
      content: {
        "application/json": {
          schema: Bz;
        };
      };
    };
    responses: {
      // Responses structure as expected by zod-openapi
      [statusCode: string]: {
        description: string;
        content?: {
          "application/json": {
            schema: ZodSchema<unknown>; // Allows any Zod schema for response (object, array, primitive)
          };
        };
      };
    };
  };
  // Schemas used for runtime validation by the `validateRequest` middleware.
  // These should typically be the *same schema objects* as those used in `openapi.requestParams` and `openapi.requestBody`.
  validationSchemas: {
    params?: Pz;
    query?: Qz;
    body?: Bz;
  };
  handler: (
    // The request object will be typed based on the Zod schemas provided
    req: TypedValidatedRequest<
      Pz extends AnyZodObject ? z.infer<Pz> : undefined,
      Qz extends AnyZodObject ? z.infer<Qz> : undefined,
      Bz extends AnyZodObject ? z.infer<Bz> : undefined
    >,
    res: Response,
    next: NextFunction,
  ) => void | Promise<void>; // Handler can be synchronous or asynchronous
}

// Function to create an Express Router and the OpenAPI paths object from route definitions
export function createRouterAndApiPaths<
  P extends AnyZodObject | undefined = undefined,
  Q extends AnyZodObject | undefined = undefined,
  B extends AnyZodObject | undefined = undefined
>(
  routeDefinitions: RouteConfig<P, Q, B>[],
) {
  const router = Router();
  const openApiPaths: Record<string, Record<string, unknown>> = {};

  for (const route of routeDefinitions) {
    const validationMiddleware = validateRequest({
      params: route.validationSchemas.params,
      query: route.validationSchemas.query,
      body: route.validationSchemas.body,
    });

    // Register the route with Express, applying the validation middleware first
    router[route.method](
      route.path,
      validationMiddleware,
      route.handler as RequestHandler,
    );

    // Convert Express path params (:param) to OpenAPI path params ({param})
    const openApiPath = route.path.replace(/:([^/]+)/g, '{$1}');
    
    // Construct the OpenAPI path item for this route
    // This directly uses the structure provided in `route.openapi`
    if (!openApiPaths[openApiPath]) {
      openApiPaths[openApiPath] = {};
    }
    openApiPaths[openApiPath][route.method] = {
      summary: route.openapi.summary,
      description: route.openapi.description,
      tags: route.openapi.tags,
      requestParams: route.openapi.requestParams,
      requestBody: route.openapi.requestBody,
      responses: route.openapi.responses,
    } as unknown;
  }
  return { router, openApiPaths };
}
