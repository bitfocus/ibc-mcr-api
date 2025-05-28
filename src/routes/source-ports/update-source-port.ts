import type { RouteConfig } from "../../utils/route-helpers";
import {
  sourcePortPathParamsSchema,
  sourcePortPutRequestBodySchema,
  sourcePortPatchRequestBodySchema,
  sourcePortSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
  validateSourcePortPatch,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the PUT /source-ports/:sourcePortId route
export const putSourcePortRoute: RouteConfig<
  typeof sourcePortPathParamsSchema,
  undefined,
  typeof sourcePortPutRequestBodySchema
> = {
  method: "put",
  path: "/source-ports/:sourcePortId",
  openapi: {
    summary: "Update a source port by ID (full update)",
    tags: ["Source Ports"],
    requestParams: {
      path: sourcePortPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: sourcePortPutRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated source port",
        content: {
          "application/json": { schema: sourcePortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or source port ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Source port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: sourcePortPathParamsSchema,
    body: sourcePortPutRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { sourcePortId } = req.validatedParams;
    const { type, channel, description } = req.validatedBody;
    console.log(`HANDLER: Updating source port ${sourcePortId}`);

    try {
      // Check if the source port exists
      const existingSourcePort = await prisma.sourcePort.findUnique({
        where: { id: sourcePortId },
      });

      if (!existingSourcePort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Source port with ID ${sourcePortId} not found`,
          }),
        );
        return;
      }

      // Update the source port using Prisma
      const updatedSourcePort = await prisma.sourcePort.update({
        where: { id: sourcePortId },
        data: {
          type,
          channel,
          description,
        },
      });

      // Format the response
      const responsePayload = {
        id: updatedSourcePort.id,
        type: updatedSourcePort.type,
        channel: updatedSourcePort.channel,
        description: updatedSourcePort.description,
        sourceId: updatedSourcePort.sourceId,
        createdAt: updatedSourcePort.createdAt.toISOString(),
        updatedAt: updatedSourcePort.updatedAt.toISOString(),
      };

      res.status(200).json(sourcePortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating source port:", error);
      next(error);
    }
  },
};

// Define the PATCH /source-ports/:sourcePortId route
export const patchSourcePortRoute: RouteConfig<
  typeof sourcePortPathParamsSchema,
  undefined,
  typeof sourcePortPatchRequestBodySchema
> = {
  method: "patch",
  path: "/source-ports/:sourcePortId",
  openapi: {
    summary: "Update a source port by ID (partial update)",
    tags: ["Source Ports"],
    requestParams: {
      path: sourcePortPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: sourcePortPatchRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated source port",
        content: {
          "application/json": { schema: sourcePortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or source port ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Source port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: sourcePortPathParamsSchema,
    body: sourcePortPatchRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { sourcePortId } = req.validatedParams;
    const updateData = req.validatedBody;
    console.log(`HANDLER: Partially updating source port ${sourcePortId}`);

    // Ensure at least one field is provided
    if (!validateSourcePortPatch(updateData)) {
      res.status(400).json({
        message: "At least one field must be provided for update",
      });
      return;
    }

    try {
      // Check if the source port exists
      const existingSourcePort = await prisma.sourcePort.findUnique({
        where: { id: sourcePortId },
      });

      if (!existingSourcePort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Source port with ID ${sourcePortId} not found`,
          }),
        );
        return;
      }

      // Update the source port using Prisma
      const updatedSourcePort = await prisma.sourcePort.update({
        where: { id: sourcePortId },
        data: updateData,
      });

      // Format the response
      const responsePayload = {
        id: updatedSourcePort.id,
        type: updatedSourcePort.type,
        channel: updatedSourcePort.channel,
        description: updatedSourcePort.description,
        sourceId: updatedSourcePort.sourceId,
        createdAt: updatedSourcePort.createdAt.toISOString(),
        updatedAt: updatedSourcePort.updatedAt.toISOString(),
      };

      res.status(200).json(sourcePortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating source port:", error);
      next(error);
    }
  },
};
