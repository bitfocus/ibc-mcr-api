import "zod-openapi/extend"; // Must be at the top
import { z } from "zod";
import { partylineSchema } from "./partyline";
import { sourcePortSchema } from "./source-port";
import { destinationPortSchema } from "./destination-port";
import { flowEdgeSchema } from "./flow-edge";

// Schema references
export const eventIdRef = "EventId";
export const titleRef = "EventTitle";
export const sourceIdRef = "SourceId";
export const sourceLabelRef = "SourceLabel";
export const destinationIdRef = "DestinationId";
export const destinationLabelRef = "DestinationLabel";
export const eventResponseRef = "EventResponse";

// Base schemas
export const eventIdSchema = z.string().uuid().openapi({
	description: "A UUIDv4 identifier for an event",
	example: "83824df7-2831-4ed9-a711-ea1a4bfb4f38"
});

export const titleSchema = z.string().min(1).openapi({
	description: "A transmission event title",
	example: "Eurovision 2049"
});

// New schemas for sources and destinations
export const sourceIdSchema = z.string().uuid().openapi({
	description: "A UUIDv4 identifier for a source",
	example: "b57e9f3d-8f7c-4c3a-9f0e-12d8a5e7b9c2"
});

export const sourceLabelSchema = z.string().min(1).openapi({
	description: "A label for a source",
	example: "Main Camera"
});

export const destinationIdSchema = z.string().uuid().openapi({
	description: "A UUIDv4 identifier for a destination",
	example: "d8f7c4c3-a9f0-e12d-8a5e-7b9c2b57e9f3"
});

export const destinationLabelSchema = z.string().min(1).openapi({
	description: "A label for a destination",
	example: "Output Stream 1"
});

// Source schema with ports
export const sourceWithPortsSchema = z.object({
	id: sourceIdSchema,
	label: sourceLabelSchema,
	ports: z.array(sourcePortSchema).optional(),
});

// Source schema (basic version without ports)
export const sourceSchema = z.object({
	id: sourceIdSchema,
	label: sourceLabelSchema,
});

// Destination schema with ports
export const destinationWithPortsSchema = z.object({
	id: destinationIdSchema,
	label: destinationLabelSchema,
	ports: z.array(destinationPortSchema).optional(),
});

// Destination schema (basic version without ports)
export const destinationSchema = z.object({
	id: destinationIdSchema,
	label: destinationLabelSchema,
});

// Schema for path parameters for /events/{eventId}
export const eventPathParamsSchema = z.object({
	eventId: eventIdSchema,
});

// Schema for the request body for PUT /events/{eventId}
export const eventPutRequestBodySchema = z.object({
	title: titleSchema,
	sources: z.array(sourceSchema).optional(),
	destinations: z.array(destinationSchema).optional(),
	partylines: z.array(partylineSchema).optional(),
});

// Schema for the request body for POST /events
export const eventPostRequestBodySchema = z.object({
  title: titleSchema,
});

// Schema for the request body for PATCH /events/{eventId}
export const eventPatchRequestBodySchema = z.object({
  title: titleSchema.optional(),
});

// Validation function to ensure at least one field is provided
export const validateEventPatch = (data: z.infer<typeof eventPatchRequestBodySchema>): boolean => {
  return Object.keys(data).length > 0;
};

// Schema for a successful response concerning an event
export const eventSuccessResponseSchema = z
  .object({
    id: eventIdSchema,
    title: titleSchema,
    createdAt: z.string().datetime().openapi({
      description: "The date and time when the event was created",
      example: "2023-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "The date and time when the event was last updated",
      example: "2023-01-01T12:00:00Z",
    }),
    sources: z.array(sourceSchema).optional(),
    destinations: z.array(destinationSchema).optional(),
    partylines: z.array(partylineSchema).optional(),
  })
  .openapi({ ref: eventResponseRef });

// Schema for a detailed event response with expanded sources, destinations, partylines, and flow edges
export const eventDetailedSuccessResponseSchema = z
  .object({
    id: eventIdSchema,
    title: titleSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    sources: z.array(sourceWithPortsSchema).optional(),
    destinations: z.array(destinationWithPortsSchema).optional(),
    partylines: z.array(partylineSchema).optional(),
    flowEdges: z.array(flowEdgeSchema).optional(),
  })
  .openapi({ ref: "EventDetailedResponse" });

// Schema for a list of events
export const eventListSuccessResponseSchema = z
  .array(eventSuccessResponseSchema)
  .openapi({ ref: "EventListResponse" });
