import "zod-openapi/extend"; // Must be at the top
import { z } from "zod";
import { destinationIdSchema, destinationLabelSchema, eventIdSchema } from "./event";

// Schema references
export const destinationResponseRef = "DestinationResponse";
export const destinationListResponseRef = "DestinationListResponse";

// Schema for path parameters for /destinations/{destinationId}
export const destinationPathParamsSchema = z.object({
  destinationId: destinationIdSchema,
});

// Schema for the request body for POST /destinations
export const destinationPostRequestBodySchema = z.object({
  label: destinationLabelSchema,
  eventId: eventIdSchema,
});

// Schema for the request body for PUT /destinations/{destinationId}
export const destinationPutRequestBodySchema = z.object({
  label: destinationLabelSchema,
  eventId: eventIdSchema,
});

// Schema for the request body for PATCH /destinations/{destinationId}
export const destinationPatchRequestBodySchema = z.object({
  label: destinationLabelSchema.optional(),
  eventId: eventIdSchema.optional(),
});

// Validation function to ensure at least one field is provided
export const validateDestinationPatch = (data: z.infer<typeof destinationPatchRequestBodySchema>): boolean => {
  return Object.keys(data).length > 0;
};

// Schema for a successful response concerning a destination
export const destinationSuccessResponseSchema = z
  .object({
    id: destinationIdSchema,
    label: destinationLabelSchema,
    eventId: eventIdSchema,
    createdAt: z.string().datetime().openapi({
      description: "The date and time when the destination was created",
      example: "2023-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "The date and time when the destination was last updated",
      example: "2023-01-01T12:00:00Z",
    }),
  })
  .openapi({ ref: destinationResponseRef });

// Schema for a list of destinations
export const destinationListSuccessResponseSchema = z
  .array(destinationSuccessResponseSchema)
  .openapi({ ref: destinationListResponseRef });
