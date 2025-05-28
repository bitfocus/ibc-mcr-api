import "zod-openapi/extend"; // Must be at the top
import { z } from "zod";
import { sourcePortSchema } from "./source-port";
import { destinationPortSchema } from "./destination-port";

// Schema references
export const flowEdgeIdRef = "FlowEdgeId";
export const flowEdgeResponseRef = "FlowEdgeResponse";

// Base schemas
export const flowEdgeIdSchema = z.string().uuid().openapi({
  description: "A UUIDv4 identifier for a flow edge",
  example: "83824df7-2831-4ed9-a711-ea1a4bfb4f38"
});

// Flow edge schema
export const flowEdgeSchema = z.object({
  id: flowEdgeIdSchema,
  sourcePortId: z.string().uuid(),
  destinationPortId: z.string().uuid(),
});

// Schema for path parameters for /flow-edges/{flowEdgeId}
export const flowEdgePathParamsSchema = z.object({
  flowEdgeId: flowEdgeIdSchema,
});

// Schema for the request body for POST /flow-edges
export const flowEdgePostRequestBodySchema = z.object({
  sourcePortId: z.string().uuid(),
  destinationPortId: z.string().uuid(),
});

// Schema for a successful response concerning a flow edge
export const flowEdgeSuccessResponseSchema = z
  .object({
    id: flowEdgeIdSchema,
    sourcePortId: z.string().uuid(),
    destinationPortId: z.string().uuid(),
    createdAt: z.string().datetime().openapi({
      description: "The date and time when the flow edge was created",
      example: "2023-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "The date and time when the flow edge was last updated",
      example: "2023-01-01T12:00:00Z",
    }),
  })
  .openapi({ ref: flowEdgeResponseRef });

// Schema for a detailed flow edge response with expanded source and destination ports
export const flowEdgeDetailedSuccessResponseSchema = z
  .object({
    id: flowEdgeIdSchema,
    sourcePort: sourcePortSchema,
    destinationPort: destinationPortSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi({ ref: "FlowEdgeDetailedResponse" });

// Schema for a list of flow edges
export const flowEdgeListSuccessResponseSchema = z
  .array(flowEdgeSuccessResponseSchema)
  .openapi({ ref: "FlowEdgeListResponse" });

// Schema for a list of detailed flow edges
export const flowEdgeDetailedListSuccessResponseSchema = z
  .array(flowEdgeDetailedSuccessResponseSchema)
  .openapi({ ref: "FlowEdgeDetailedListResponse" });
