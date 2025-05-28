import "zod-openapi/extend"; // Must be at the top
import { z } from "zod";

// Schema references
export const sourcePortIdRef = "SourcePortId";
export const sourcePortTypeRef = "SourcePortType";
export const sourcePortChannelRef = "SourcePortChannel";
export const sourcePortDescriptionRef = "SourcePortDescription";
export const sourcePortResponseRef = "SourcePortResponse";

// Base schemas
export const sourcePortIdSchema = z.string().uuid().openapi({
  description: "A UUIDv4 identifier for a source port",
  example: "83824df7-2831-4ed9-a711-ea1a4bfb4f38"
});

export const sourcePortTypeSchema = z.string().min(1).openapi({
  description: "The type of the source port (e.g., video, audio)",
  example: "audio"
});

export const sourcePortChannelSchema = z.number().int().min(1).openapi({
  description: "The channel number of the source port",
  example: 1
});

export const sourcePortDescriptionSchema = z.string().optional().openapi({
  description: "Optional description of the source port",
  example: "Main audio feed"
});

// Source port schema
export const sourcePortSchema = z.object({
  id: sourcePortIdSchema,
  type: sourcePortTypeSchema,
  channel: sourcePortChannelSchema,
  description: sourcePortDescriptionSchema,
});

// Schema for path parameters for /source-ports/{sourcePortId}
export const sourcePortPathParamsSchema = z.object({
  sourcePortId: sourcePortIdSchema,
});

// Schema for the request body for POST /source-ports
export const sourcePortPostRequestBodySchema = z.object({
  type: sourcePortTypeSchema,
  channel: sourcePortChannelSchema,
  description: sourcePortDescriptionSchema,
  sourceId: z.string().uuid(),
});

// Schema for the request body for PUT /source-ports/{sourcePortId}
export const sourcePortPutRequestBodySchema = z.object({
  type: sourcePortTypeSchema,
  channel: sourcePortChannelSchema,
  description: sourcePortDescriptionSchema,
});

// Schema for the request body for PATCH /source-ports/{sourcePortId}
export const sourcePortPatchRequestBodySchema = z.object({
  type: sourcePortTypeSchema.optional(),
  channel: sourcePortChannelSchema.optional(),
  description: sourcePortDescriptionSchema,
});

// Validation function to ensure at least one field is provided
export const validateSourcePortPatch = (data: z.infer<typeof sourcePortPatchRequestBodySchema>): boolean => {
  return Object.keys(data).length > 0;
};

// Schema for a successful response concerning a source port
export const sourcePortSuccessResponseSchema = z
  .object({
    id: sourcePortIdSchema,
    type: sourcePortTypeSchema,
    channel: sourcePortChannelSchema,
    description: sourcePortDescriptionSchema,
    sourceId: z.string().uuid(),
    createdAt: z.string().datetime().openapi({
      description: "The date and time when the source port was created",
      example: "2023-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "The date and time when the source port was last updated",
      example: "2023-01-01T12:00:00Z",
    }),
  })
  .openapi({ ref: sourcePortResponseRef });

// Schema for a list of source ports
export const sourcePortListSuccessResponseSchema = z
  .array(sourcePortSuccessResponseSchema)
  .openapi({ ref: "SourcePortListResponse" });
