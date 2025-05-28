import type { RouteConfig } from "../../utils/route-helpers";
import {
  sourcePortPostRequestBodySchema,
  sourcePortSuccessResponseSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the POST /source-ports route
export const createSourcePortRoute: RouteConfig<
  undefined,
  undefined,
  typeof sourcePortPostRequestBodySchema
> = {
  method: "post",
  path: "/source-ports",
  openapi: {
    summary: "Create a new source port",
    tags: ["Source Ports"],
    requestBody: {
      content: {
        "application/json": { schema: sourcePortPostRequestBodySchema },
      },
    },
    responses: {
      "201": {
        description: "Created - Successfully created source port",
        content: {
          "application/json": { schema: sourcePortSuccessResponseSchema },
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
    body: sourcePortPostRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { type, channel, description, sourceId } = req.validatedBody;
    console.log(`HANDLER: Creating source port of type "${type}" for source ${sourceId}`);

    try {
      // Check if the source exists
      const source = await prisma.source.findUnique({
        where: { id: sourceId },
      });

      if (!source) {
        res.status(400).json({
          message: `Source with ID ${sourceId} not found`,
        });
        return;
      }

      // Create the source port using Prisma
      const sourcePort = await prisma.sourcePort.create({
        data: {
          type,
          channel,
          description,
          source: {
            connect: { id: sourceId },
          },
        },
      });

      // Format the response
      const responsePayload = {
        id: sourcePort.id,
        type: sourcePort.type,
        channel: sourcePort.channel,
        description: sourcePort.description,
        sourceId: sourcePort.sourceId,
        createdAt: sourcePort.createdAt.toISOString(),
        updatedAt: sourcePort.updatedAt.toISOString(),
      };

      res.status(201).json(sourcePortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error creating source port:", error);
      next(error);
    }
  },
};
