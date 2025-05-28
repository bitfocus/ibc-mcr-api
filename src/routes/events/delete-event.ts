import type { RouteConfig } from "../../utils/route-helpers";
import {
  eventPathParamsSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the DELETE /events/:eventId route
export const deleteEventRoute: RouteConfig<
  typeof eventPathParamsSchema,
  undefined,
  undefined
> = {
  method: "delete",
  path: "/events/:eventId",
  openapi: {
    summary: "Delete an event",
    tags: ["Events"],
    requestParams: {
      path: eventPathParamsSchema,
    },
    responses: {
      "204": {
        description: "No Content - Successfully deleted event",
      },
      "400": {
        description: "Bad Request - Invalid event ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Event not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
      "500": {
        description: "Internal Server Error",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  },
  validationSchemas: {
    params: eventPathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { eventId } = req.validatedParams;
    console.log(`HANDLER: Deleting event ${eventId}`);

    try {
      // First check if the event exists

      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Event with ID ${eventId} not found`,
          }),
        );
        return;
      }

      // Delete the event using Prisma

      await prisma.event.delete({
        where: { id: eventId },
      });

      // Return 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting event:", error);
      next(error);
    }
  },
};
