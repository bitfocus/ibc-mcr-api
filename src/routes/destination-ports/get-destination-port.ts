import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPortPathParamsSchema,
  destinationPortSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the GET /destination-ports/:destinationPortId route
export const getDestinationPortRoute: RouteConfig<
  typeof destinationPortPathParamsSchema,
  undefined,
  undefined
> = {
  method: "get",
  path: "/destination-ports/:destinationPortId",
  openapi: {
    summary: "Get a destination port by ID",
    tags: ["Destination Ports"],
    requestParams: {
      path: destinationPortPathParamsSchema,
    },
    responses: {
      "200": {
        description: "OK - Successfully retrieved destination port",
        content: {
          "application/json": { schema: destinationPortSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid Destination Port ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination Port not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPortPathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { destinationPortId } = req.validatedParams;
    console.log(`HANDLER: Fetching destination port ${destinationPortId}`);

    try {
      // Try to find the destination port using Prisma
      const destinationPort = await prisma.destinationPort.findUnique({
        where: { id: destinationPortId },
        include: {
          destination: true,
        },
      });

      // Check if the destination port exists
      if (!destinationPort) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination Port with ID ${destinationPortId} not found`,
          }),
        );
        return;
      }

      // Format the response using the actual destination port data
      const responsePayload = {
        id: destinationPort.id,
        type: destinationPort.type,
        channel: destinationPort.channel,
        description: destinationPort.description,
        destinationId: destinationPort.destinationId,
        createdAt: destinationPort.createdAt.toISOString(),
        updatedAt: destinationPort.updatedAt.toISOString(),
      };

      res.status(200).json(destinationPortSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error fetching destination port:", error);
      next(error);
    }
  },
};
