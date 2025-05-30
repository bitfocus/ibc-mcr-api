import type { RouteConfig } from "../../utils/route-helpers";
import {
  partylinePathParamsSchema,
  partylinePutRequestBodySchema,
  partylinePatchRequestBodySchema,
  partylineSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
  validatePartylinePatch,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the PUT /partylines/:partylineId route
export const putPartylineRoute: RouteConfig<
  typeof partylinePathParamsSchema,
  undefined,
  typeof partylinePutRequestBodySchema
> = {
  method: "put",
  path: "/partylines/:partylineId",
  openapi: {
    summary: "Update a partyline by ID (full update)",
    tags: ["Partylines"],
    requestParams: {
      path: partylinePathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: partylinePutRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated partyline",
        content: {
          "application/json": { schema: partylineSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or partyline ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Partyline not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: partylinePathParamsSchema,
    body: partylinePutRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { partylineId } = req.validatedParams;
    const { title } = req.validatedBody;
    console.log(`HANDLER: Updating partyline ${partylineId}`);

    try {
      // Check if the partyline exists
      const existingPartyline = await prisma.partyline.findUnique({
        where: { id: partylineId },
      });

      if (!existingPartyline) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Partyline with ID ${partylineId} not found`,
          }),
        );
        return;
      }

      // Update the partyline using Prisma
      const updatedPartyline = await prisma.partyline.update({
        where: { id: partylineId },
        data: {
          title,
        },
      });

      // Format the response
      const responsePayload = {
        id: updatedPartyline.id,
        title: updatedPartyline.title,
        eventId: updatedPartyline.eventId,
        createdAt: updatedPartyline.createdAt.toISOString(),
        updatedAt: updatedPartyline.updatedAt.toISOString(),
      };

      res.status(200).json(partylineSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating partyline:", error);
      next(error);
    }
  },
};

// Define the PATCH /partylines/:partylineId route
export const patchPartylineRoute: RouteConfig<
  typeof partylinePathParamsSchema,
  undefined,
  typeof partylinePatchRequestBodySchema
> = {
  method: "patch",
  path: "/partylines/:partylineId",
  openapi: {
    summary: "Update a partyline by ID (partial update)",
    tags: ["Partylines"],
    requestParams: {
      path: partylinePathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: partylinePatchRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Successfully updated partyline",
        content: {
          "application/json": { schema: partylineSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid request body or partyline ID",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Partyline not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: partylinePathParamsSchema,
    body: partylinePatchRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { partylineId } = req.validatedParams;
    const updateData = req.validatedBody;
    console.log(`HANDLER: Partially updating partyline ${partylineId}`);

    // Ensure at least one field is provided
    if (!validatePartylinePatch(updateData)) {
      res.status(400).json({
        message: "At least one field must be provided for update",
      });
      return;
    }

    try {
      // Check if the partyline exists
      const existingPartyline = await prisma.partyline.findUnique({
        where: { id: partylineId },
      });

      if (!existingPartyline) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Partyline with ID ${partylineId} not found`,
          }),
        );
        return;
      }

      // Update the partyline using Prisma
      const updatedPartyline = await prisma.partyline.update({
        where: { id: partylineId },
        data: updateData,
      });

      // Format the response
      const responsePayload = {
        id: updatedPartyline.id,
        title: updatedPartyline.title,
        eventId: updatedPartyline.eventId,
        createdAt: updatedPartyline.createdAt.toISOString(),
        updatedAt: updatedPartyline.updatedAt.toISOString(),
      };

      res.status(200).json(partylineSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error updating partyline:", error);
      next(error);
    }
  },
};
