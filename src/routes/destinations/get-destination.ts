import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationPathParamsSchema,
  destinationSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the GET /destinations/:destinationId route
export const getDestinationRoute: RouteConfig<
  typeof destinationPathParamsSchema,
  undefined,
  undefined
> = {
  method: "get",
  path: "/destinations/:destinationId",
  openapi: {
    summary: "Get a destination by ID",
    tags: ["Destinations"],
    requestParams: {
      path: destinationPathParamsSchema,
    },
    responses: {
      "200": {
        description: "OK - Successfully retrieved destination",
        content: {
          "application/json": { schema: destinationSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid Destination ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Destination not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  },
  validationSchemas: {
    params: destinationPathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { destinationId } = req.validatedParams;
    console.log(`HANDLER: Fetching destination ${destinationId}`);

    try {

      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });

      if (!destination) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Destination with ID ${destinationId} not found`,
          }),
        );
        return;
      }

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
      console.error("Error fetching destination:", error);
      next(error);
    }
  },
};
