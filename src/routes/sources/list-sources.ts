import type { RouteConfig } from "../../utils/route-helpers";
import {
  sourceListSuccessResponseSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the GET /sources route
export const listSourcesRoute: RouteConfig<
  undefined,
  undefined,
  undefined
> = {
  method: "get",
  path: "/sources",
  openapi: {
    summary: "List all sources",
    tags: ["Sources"],
    responses: {
      "200": {
        description: "OK - Successfully retrieved sources",
        content: {
          "application/json": { schema: sourceListSuccessResponseSchema },
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
    console.log("HANDLER: Listing all sources");

    try {

      const sources = await prisma.source.findMany();

      // Format dates as ISO strings for the response
      const response = sources.map(source => ({
        ...source,
        createdAt: source.createdAt instanceof Date 
          ? source.createdAt.toISOString() 
          : source.createdAt,
        updatedAt: source.updatedAt instanceof Date 
          ? source.updatedAt.toISOString() 
          : source.updatedAt,
      }));

      res.status(200).json(sourceListSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error listing sources:", error);
      next(error);
    }
  },
};
