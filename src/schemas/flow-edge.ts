import 'zod-openapi/extend' // Must be at the top
import { z } from 'zod'

// Schema references
export const flowEdgeIdRef = 'FlowEdgeId'
export const flowEdgeResponseRef = 'FlowEdgeResponse'

// Base schemas
export const flowEdgeIdSchema = z.string().uuid().openapi({
	description: 'A UUIDv4 identifier for a flow edge',
	example: '83824df7-2831-4ed9-a711-ea1a4bfb4f38',
})

// Schema for flow edge
export const flowEdgeSchema = z.object({
	id: flowEdgeIdSchema,
	sourcePortId: z.string().uuid(),
	destinationPortId: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

// Schema for flow edge path parameters
export const flowEdgePathParamsSchema = z.object({
	flowEdgeId: flowEdgeIdSchema,
})

// Schema for flow edge post request body
export const flowEdgePostRequestBodySchema = z.object({
	sourcePortId: z.string().uuid(),
	destinationPortId: z.string().uuid(),
})

// Schema for flow edge success response
export const flowEdgeSuccessResponseSchema = z.object({
	id: flowEdgeIdSchema,
	sourcePortId: z.string().uuid(),
	destinationPortId: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi({ ref: flowEdgeResponseRef })

// Schema for flow edge list success response
export const flowEdgeListSuccessResponseSchema = z.array(flowEdgeSuccessResponseSchema)
