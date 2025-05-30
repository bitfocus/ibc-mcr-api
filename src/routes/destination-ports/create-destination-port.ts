import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPortPostRequestBodySchema,
  destinationPortSuccessResponseSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the POST /destination-ports route
export const createDestinationPortRoute: RouteConfig<
  undefined,
  undefined,
  typeof destinationPortPostRequestBodySchema
> = {
  method: "post",
  path: "/destination-ports",
  openapi: {
    summary: "Create a new destination port",
    tags: ["Destination Ports"],
    requestBody: {
      content: {
        "application/json": { schema: destinationPortPostRequestBodySchema },
      },
    },
    responses: {
      "201": {
        description: "Created - Successfully created destination port",
        content: {
          "application/json": { schema: destinationPortSuccessResponseSchema },
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
    body: destinationPortPostRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { type, channel, description, destinationId } = req.validatedBody;
    console.log(`HANDLER: Creating destination port of type "${type}" for destination ${destinationId}`);

    try {
      // Check if the destination exists
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });

      if (!destination) {
        res.status(400).json({
          message: `Destination with ID ${destinationId} not found`,
        });
        return;
      }

      // Create the destination port using Prisma
      const destinationPort = await prisma.destinationPort.create({
        data: {
          type,
          channel,
          description,
          destination: {
            connect: { id: destinationId },
          },
        },
      });

      // Format the response
      const responsePayload = {
        id: destinationPort.id,
        type: destinationPort.type,
        channel: destinationPort.channel,
        description: destinationPort.description,
        destinationId: destinationPort.destinationId,
        createdAt: destinationPort.createdAt.toISOString(),
        updatedAt: destinationPort.updatedAt.toISOString(),
      };

      res.status(201).json(destinationPortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error creating destination port:", error);
      next(error);
    }
  },
};
