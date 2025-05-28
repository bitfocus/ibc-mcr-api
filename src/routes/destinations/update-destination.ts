import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPathParamsSchema,
  destinationPutRequestBodySchema,
  destinationPatchRequestBodySchema,
  destinationSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
  validateDestinationPatch,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the PUT /destinations/:destinationId route
export const putDestinationRoute: RouteConfig<
  typeof destinationPathParamsSchema,
  undefined,
  typeof destinationPutRequestBodySchema
> = {
  method: "put",
  path: "/destinations/:destinationId",
  openapi: {
    summary: "Replace a destination",
    tags: ["Destinations"],
    requestParams: {
      path: destinationPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: destinationPutRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated destination",
        content: {
          "application/json": { schema: destinationSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or destination ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPathParamsSchema,
    body: destinationPutRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { destinationId } = req.validatedParams;
    const { label, eventId } = req.validatedBody;
    console.log(`HANDLER: Updating destination ${destinationId}`);

    try {

      const destination = await prisma.destination.update({
        where: { id: destinationId },
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

      res.status(200).json(destinationSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error updating destination:", error);
      
      // Check if it's a "not found" error
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination with ID ${destinationId} not found`,
          }),
        );
        return;
      }
      
      next(error);
    }
  },
};

// Define the PATCH /destinations/:destinationId route
export const patchDestinationRoute: RouteConfig<
  typeof destinationPathParamsSchema,
  undefined,
  typeof destinationPatchRequestBodySchema
> = {
  method: "patch",
  path: "/destinations/:destinationId",
  openapi: {
    summary: "Update a destination partially",
    tags: ["Destinations"],
    requestParams: {
      path: destinationPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: destinationPatchRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated destination",
        content: {
          "application/json": { schema: destinationSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or destination ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPathParamsSchema,
    body: destinationPatchRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { destinationId } = req.validatedParams;
    const updateData = req.validatedBody;
    console.log(`HANDLER: Partially updating destination ${destinationId}`);

    // Validate that at least one field is provided
    if (!validateDestinationPatch(updateData)) {
      res.status(400).json(
        errorSchema.parse({
          message: "At least one field must be provided for update",
        }),
      );
      return;
    }

    try {

      const destination = await prisma.destination.update({
        where: { id: destinationId },
        data: updateData,
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

      res.status(200).json(destinationSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error updating destination:", error);
      
      // Check if it's a "not found" error
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination with ID ${destinationId} not found`,
          }),
        );
        return;
      }
      
      next(error);
    }
  },
};
