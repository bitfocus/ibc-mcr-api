import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPortPathParamsSchema,
  destinationPortPutRequestBodySchema,
  destinationPortPatchRequestBodySchema,
  destinationPortSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
  validateDestinationPortPatch,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the PUT /destination-ports/:destinationPortId route
export const putDestinationPortRoute: RouteConfig<
  typeof destinationPortPathParamsSchema,
  undefined,
  typeof destinationPortPutRequestBodySchema
> = {
  method: "put",
  path: "/destination-ports/:destinationPortId",
  openapi: {
    summary: "Update a destination port by ID (full update)",
    tags: ["Destination Ports"],
    requestParams: {
      path: destinationPortPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: destinationPortPutRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated destination port",
        content: {
          "application/json": { schema: destinationPortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or destination port ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPortPathParamsSchema,
    body: destinationPortPutRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { destinationPortId } = req.validatedParams;
    const { type, channel, description } = req.validatedBody;
    console.log(`HANDLER: Updating destination port ${destinationPortId}`);

    try {
      // Check if the destination port exists
      const existingDestinationPort = await prisma.destinationPort.findUnique({
        where: { id: destinationPortId },
      });

      if (!existingDestinationPort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination port with ID ${destinationPortId} not found`,
          }),
        );
        return;
      }

      // Update the destination port using Prisma
      const updatedDestinationPort = await prisma.destinationPort.update({
        where: { id: destinationPortId },
        data: {
          type,
          channel,
          description,
        },
      });

      // Format the response
      const responsePayload = {
        id: updatedDestinationPort.id,
        type: updatedDestinationPort.type,
        channel: updatedDestinationPort.channel,
        description: updatedDestinationPort.description,
        destinationId: updatedDestinationPort.destinationId,
        createdAt: updatedDestinationPort.createdAt.toISOString(),
        updatedAt: updatedDestinationPort.updatedAt.toISOString(),
      };

      res.status(200).json(destinationPortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating destination port:", error);
      next(error);
    }
  },
};

// Define the PATCH /destination-ports/:destinationPortId route
export const patchDestinationPortRoute: RouteConfig<
  typeof destinationPortPathParamsSchema,
  undefined,
  typeof destinationPortPatchRequestBodySchema
> = {
  method: "patch",
  path: "/destination-ports/:destinationPortId",
  openapi: {
    summary: "Update a destination port by ID (partial update)",
    tags: ["Destination Ports"],
    requestParams: {
      path: destinationPortPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: destinationPortPatchRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated destination port",
        content: {
          "application/json": { schema: destinationPortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or destination port ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPortPathParamsSchema,
    body: destinationPortPatchRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { destinationPortId } = req.validatedParams;
    const updateData = req.validatedBody;
    console.log(`HANDLER: Partially updating destination port ${destinationPortId}`);

    // Ensure at least one field is provided
    if (!validateDestinationPortPatch(updateData)) {
      res.status(400).json({
        message: "At least one field must be provided for update",
      });
      return;
    }

    try {
      // Check if the destination port exists
      const existingDestinationPort = await prisma.destinationPort.findUnique({
        where: { id: destinationPortId },
      });

      if (!existingDestinationPort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination port with ID ${destinationPortId} not found`,
          }),
        );
        return;
      }

      // Update the destination port using Prisma
      const updatedDestinationPort = await prisma.destinationPort.update({
        where: { id: destinationPortId },
        data: updateData,
      });

      // Format the response
      const responsePayload = {
        id: updatedDestinationPort.id,
        type: updatedDestinationPort.type,
        channel: updatedDestinationPort.channel,
        description: updatedDestinationPort.description,
        destinationId: updatedDestinationPort.destinationId,
        createdAt: updatedDestinationPort.createdAt.toISOString(),
        updatedAt: updatedDestinationPort.updatedAt.toISOString(),
      };

      res.status(200).json(destinationPortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating destination port:", error);
      next(error);
    }
  },
};
