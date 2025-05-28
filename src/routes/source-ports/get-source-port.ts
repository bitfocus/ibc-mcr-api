import type { RouteConfig } from "../../utils/route-helpers";
import {
  sourcePortPathParamsSchema,
  sourcePortSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the GET /source-ports/:sourcePortId route
export const getSourcePortRoute: RouteConfig<
  typeof sourcePortPathParamsSchema,
  undefined,
  undefined
> = {
  method: "get",
  path: "/source-ports/:sourcePortId",
  openapi: {
    summary: "Get a source port by ID",
    tags: ["Source Ports"],
    requestParams: {
      path: sourcePortPathParamsSchema,
    },
    responses: {
      "200": {
        description: "OK - Successfully retrieved source port",
        content: {
          "application/json": { schema: sourcePortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid Source Port ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Source Port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  },
  validationSchemas: {
    params: sourcePortPathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { sourcePortId } = req.validatedParams;
    console.log(`HANDLER: Fetching source port ${sourcePortId}`);

    try {
      // Try to find the source port using Prisma
      const sourcePort = await prisma.sourcePort.findUnique({
        where: { id: sourcePortId },
        include: {
          source: true,
        },
      });

      // Check if the source port exists
      if (!sourcePort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Source Port with ID ${sourcePortId} not found`,
          }),
        );
        return;
      }

      // Format the response using the actual source port data
      const responsePayload = {
        id: sourcePort.id,
        type: sourcePort.type,
        channel: sourcePort.channel,
        description: sourcePort.description,
        sourceId: sourcePort.sourceId,
        createdAt: sourcePort.createdAt.toISOString(),
        updatedAt: sourcePort.updatedAt.toISOString(),
      };

      res.status(200).json(sourcePortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error fetching source port:", error);
      next(error);
    }
  },
};
