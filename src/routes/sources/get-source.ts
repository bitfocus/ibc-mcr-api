import type { RouteConfig } from "../../utils/route-helpers";
import {
  sourcePathParamsSchema,
  sourceSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "../../utils/prisma";

// Define the GET /sources/:sourceId route
export const getSourceRoute: RouteConfig<
  typeof sourcePathParamsSchema,
  undefined,
  undefined
> = {
  method: "get",
  path: "/sources/:sourceId",
  openapi: {
    summary: "Get a source by ID",
    tags: ["Sources"],
    requestParams: {
      path: sourcePathParamsSchema,
    },
    responses: {
      "200": {
        description: "OK - Successfully retrieved source",
        content: {
          "application/json": { schema: sourceSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid Source ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Source not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  },
  validationSchemas: {
    params: sourcePathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { sourceId } = req.validatedParams;
    console.log(`HANDLER: Fetching source ${sourceId}`);

    try {

      const source = await prisma.source.findUnique({
        where: { id: sourceId },
      });

      if (!source) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Source with ID ${sourceId} not found`,
          }),
        );
        return;
      }

      // Format dates as ISO strings for the response
      const response = {
        ...source,
        createdAt: source.createdAt instanceof Date 
          ? source.createdAt.toISOString() 
          : source.createdAt,
        updatedAt: source.updatedAt instanceof Date 
          ? source.updatedAt.toISOString() 
          : source.updatedAt,
      };

      res.status(200).json(sourceSuccessResponseSchema.parse(response));
    } catch (error) {
      console.error("Error fetching source:", error);
      next(error);
    }
  },
};
