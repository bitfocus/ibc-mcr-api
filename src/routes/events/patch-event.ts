import type { RouteConfig } from "../../utils/route-helpers";
import {
  eventPathParamsSchema,
  eventPatchRequestBodySchema,
  eventSuccessResponseSchema,
  notFoundSchema,
  errorSchema,
  validateEventPatch,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the PATCH /events/:eventId route
export const patchEventRoute: RouteConfig<
  typeof eventPathParamsSchema,
  undefined,
  typeof eventPatchRequestBodySchema
> = {
  method: "patch",
  path: "/events/:eventId",
  openapi: {
    summary: "Update an event partially",
    tags: ["Events"],
    requestParams: {
      path: eventPathParamsSchema,
    },
    requestBody: {
      content: {
        "application/json": { schema: eventPatchRequestBodySchema },
      },
    },
    responses: {
      "200": {
        description: "OK - Event updated successfully",
        content: {
          "application/json": { schema: eventSuccessResponseSchema },
        },
      },
      "400": {
        description: "Bad Request - Invalid input",
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
    body: eventPatchRequestBodySchema,
  },
  handler: async (req, res, next) => {
    const { eventId } = req.validatedParams;
    const updateData = req.validatedBody;
    console.log(`HANDLER: Partially updating event ${eventId}`);

    // Validate that at least one field is provided
    if (!validateEventPatch(updateData)) {
      res.status(400).json(
        errorSchema.parse({
          message: "At least one field must be provided for update",
        }),
      );
      return;
    }

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

      // Update the event using Prisma

      const event = await prisma.event.update({
        where: { id: eventId },
        data: updateData,
        include: {
          sources: true,
          destinations: true,
        },
      });

      // Format the response according to our schema
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
      console.error("Error updating event:", error);
      next(error);
    }
  },
};
