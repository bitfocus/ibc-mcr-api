import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPortPathParamsSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the DELETE /destination-ports/:destinationPortId route
export const deleteDestinationPortRoute: RouteConfig<
  typeof destinationPortPathParamsSchema,
  undefined,
  undefined
> = {
  method: "delete",
  path: "/destination-ports/:destinationPortId",
  openapi: {
    summary: "Delete a destination port by ID",
    tags: ["Destination Ports"],
    requestParams: {
      path: destinationPortPathParamsSchema,
    },
    responses: {
      "204": {
        description: "No Content - Successfully deleted destination port",
      },
      "400": {
        description: "Bad Request - Invalid destination port ID format",
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
  },
  handler: async (req, res, next) => {
    const { destinationPortId } = req.validatedParams;
    console.log(`HANDLER: Deleting destination port ${destinationPortId}`);

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

      // Check if there are any flow edges connected to this destination port
      const connectedFlowEdges = await prisma.flowEdge.findMany({
        where: { destinationPortId },
      });

      if (connectedFlowEdges.length > 0) {
        // Delete all connected flow edges first
        await prisma.flowEdge.deleteMany({
          where: { destinationPortId },
        });
        console.log(`Deleted ${connectedFlowEdges.length} flow edges connected to destination port ${destinationPortId}`);
      }

      // Delete the destination port using Prisma
      await prisma.destinationPort.delete({
        where: { id: destinationPortId },
      });

      // Return 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting destination port:", error);
      next(error);
    }
  },
};
