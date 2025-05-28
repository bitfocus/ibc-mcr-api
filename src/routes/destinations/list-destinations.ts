import type { RouteConfig } from "../../utils/route-helpers";
import {
  destinationListSuccessResponseSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the GET /destinations route
export const listDestinationsRoute: RouteConfig<
  undefined,
  undefined,
  undefined
> = {
  method: "get",
  path: "/destinations",
  openapi: {
    summary: "List all destinations",
    tags: ["Destinations"],
    responses: {
      "200": {
        description: "OK - Successfully retrieved destinations",
        content: {
          "application/json": { schema: destinationListSuccessResponseSchema },
        },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {},
  handler: async (req, res, next) => {
    console.log("HANDLER: Listing all destinations");

    try {

      const destinations = await prisma.destination.findMany();

      // Format dates as ISO strings for the response
      const response = destinations.map(destination => ({
        ...destination,
        createdAt: destination.createdAt instanceof Date 
          ? destination.createdAt.toISOString() 
          : destination.createdAt,
        updatedAt: destination.updatedAt instanceof Date 
          ? destination.updatedAt.toISOString() 
          : destination.updatedAt,
      }));

      res.status(200).json(destinationListSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error listing destinations:", error);
      next(error);
    }
  },
};
