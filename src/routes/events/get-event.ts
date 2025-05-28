import type { RouteConfig } from "../../utils/route-helpers";
import {
  eventPathParamsSchema,
  eventSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the GET /events/:eventId route
export const getEventRoute: RouteConfig<
  typeof eventPathParamsSchema,
  undefined,
  undefined
> = {
  method: "get",
  path: "/events/:eventId",
  openapi: {
    summary: "Get an event by ID",
    tags: ["Events"],
    requestParams: {
      path: eventPathParamsSchema,
    },
    responses: {
      "200": {
        description: "OK - Successfully retrieved event",
        content: {
          "application/json": { schema: eventSuccessResponseSchema },
        },
      },
      "400": {
        // For invalid UUID format passed in path
        description: "Bad Request - Invalid Event ID format",
        content: { "application/json": { schema: errorSchema } },
      },
      "404": {
        description: "Not Found - Event not found",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  },
  validationSchemas: {
    params: eventPathParamsSchema,
  },
  handler: async (req, res, next) => {
    const { eventId } = req.validatedParams;
    console.log(`HANDLER: Fetching event ${eventId}`);

    try {
      // Try to find the event using Prisma

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          sources: true,
          destinations: true,
        },
      });

      // Check if the event exists
      if (!event) {
        res.status(404).json(
          notFoundSchema.parse({
            message: `Event with ID ${eventId} not found`,
          }),
        );
        return;
      }

      // Format the response using the actual event data
      const responsePayload = {
        id: event.id,
        title: event.title,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
        sources: event.sources?.map(source => ({
          id: source.id,
          label: source.label,
        })) || [],
        destinations: event.destinations?.map(destination => ({
          id: destination.id,
          label: destination.label,
        })) || [],
      };

      res.status(200).json(eventSuccessResponseSchema.parse(responsePayload));
    } catch (error) {
      console.error("Error fetching event:", error);
      next(error);
    }
  },
};
