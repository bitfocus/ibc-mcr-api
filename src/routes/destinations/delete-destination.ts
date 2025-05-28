import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPathParamsSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the DELETE /destinations/:destinationId route
export const deleteDestinationRoute: RouteConfig<
  typeof destinationPathParamsSchema,
  undefined,
  undefined
> = {
  method: "delete",
  path: "/destinations/:destinationId",
  openapi: {
    summary: "Delete a destination",
    tags: ["Destinations"],
    requestParams: {
      path: destinationPathParamsSchema,
    },
    responses: {
      "204": {
        description: "No Content - Successfully deleted destination",
      },
      "400": {
        description: "Bad Request - Invalid destination ID format",
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
  },
  handler: async (req, res, next) => {
    const { destinationId } = req.validatedParams;
    console.log(`HANDLER: Deleting destination ${destinationId}`);

    try {

      const destination = await prisma.destination.delete({
        where: { id: destinationId },
      });

      // Return 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting destination:", error);
      
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
