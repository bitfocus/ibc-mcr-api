import "zod-openapi/extend"; // Must be at the top
import { z } from "zod";

// Schema references
export const partylineIdRef = "PartylineId";
export const partylineTitleRef = "PartylineTitle";
export const partylineResponseRef = "PartylineResponse";

// Base schemas
export const partylineIdSchema = z.string().uuid().openapi({
  description: "A UUIDv4 identifier for a partyline",
  example: "83824df7-2831-4ed9-a711-ea1a4bfb4f38"
});

export const partylineTitleSchema = z.string().min(1).openapi({
  description: "A communication partyline title",
  example: "Main Communication Channel"
});

// Partyline schema
export const partylineSchema = z.object({
  id: partylineIdSchema,
  title: partylineTitleSchema,
});

// Schema for path parameters for /partylines/{partylineId}
export const partylinePathParamsSchema = z.object({
  partylineId: partylineIdSchema,
});

// Schema for the request body for POST /partylines
export const partylinePostRequestBodySchema = z.object({
  title: partylineTitleSchema,
  eventId: z.string().uuid(),
});

// Schema for the request body for PUT /partylines/{partylineId}
export const partylinePutRequestBodySchema = z.object({
  title: partylineTitleSchema,
});

// Schema for the request body for PATCH /partylines/{partylineId}
export const partylinePatchRequestBodySchema = z.object({
  title: partylineTitleSchema.optional(),
});

// Validation function to ensure at least one field is provided
export const validatePartylinePatch = (data: z.infer<typeof partylinePatchRequestBodySchema>): boolean => {
  return Object.keys(data).length > 0;
};

// Schema for a successful response concerning a partyline
export const partylineSuccessResponseSchema = z
  .object({
    id: partylineIdSchema,
    title: partylineTitleSchema,
    eventId: z.string().uuid(),
    createdAt: z.string().datetime().openapi({
      description: "The date and time when the partyline was created",
      example: "2023-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "The date and time when the partyline was last updated",
      example: "2023-01-01T12:00:00Z",
    }),
  })
  .openapi({ ref: partylineResponseRef });

// Schema for a list of partylines
export const partylineListSuccessResponseSchema = z
  .array(partylineSuccessResponseSchema)
  .openapi({ ref: "PartylineListResponse" });
