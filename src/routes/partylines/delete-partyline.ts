import type { RouteConfig } from "../../utils/route-helpers";
import {
  partylinePathParamsSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the DELETE /partylines/:partylineId route
export const deletePartylineRoute: RouteConfig<
  typeof partylinePathParamsSchema,
  undefined,
  undefined
> = {
  method: "delete",
  path: "/partylines/:partylineId",
  openapi: {
    summary: "Delete a partyline by ID",
    tags: ["Partylines"],
    requestParams: {
      path: partylinePathParamsSchema,
    },
    responses: {
      "204": {
        description: "No Content - Successfully deleted partyline",
      },
      "400": {
        description: "Bad Request - Invalid partyline ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Partyline not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: partylinePathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { partylineId } = req.validatedParams;
    console.log(`HANDLER: Deleting partyline ${partylineId}`);

    try {
      // Check if the partyline exists
      const existingPartyline = await prisma.partyline.findUnique({
        where: { id: partylineId },
      });

      if (!existingPartyline) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Partyline with ID ${partylineId} not found`,
          }),
        );
        return;
      }

      // Delete the partyline using Prisma
      await prisma.partyline.delete({
        where: { id: partylineId },
      });

      // Return 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting partyline:", error);
      next(error);
    }
  },
};
