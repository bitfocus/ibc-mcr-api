import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPostRequestBodySchema,
  destinationSuccessResponseSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the POST /destinations route
export const createDestinationRoute: RouteConfig<
  undefined,
  undefined,
  typeof destinationPostRequestBodySchema
> = {
  method: "post",
  path: "/destinations",
  openapi: {
    summary: "Create a new destination",
    tags: ["Destinations"],
    requestBody: {
      content: {
        "application/json": { schema: destinationPostRequestBodySchema },
      },
    },
    responses: {
      "201": {
        description: "Created - Successfully created destination",
        content: {
          "application/json": { schema: destinationSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body",
        content: { "application/json": { schema: errorSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    body: destinationPostRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { label, eventId } = req.validatedBody;
    console.log(`HANDLER: Creating destination with label "${label}" for event ${eventId}`);

    try {

      const destination = await prisma.destination.create({
        data: {
          label,
          eventId,
        },
      });

      // Format dates as ISO strings for the response
      const response = {
        ...destination,
        createdAt: destination.createdAt instanceof Date 
          ? destination.createdAt.toISOString() 
          : destination.createdAt,
        updatedAt: destination.updatedAt instanceof Date 
          ? destination.updatedAt.toISOString() 
          : destination.updatedAt,
      };

      res.status(201).json(destinationSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error creating destination:", error);
      next(error);
    }
  },
};
