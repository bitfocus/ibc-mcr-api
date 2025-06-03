import 'zod-openapi/extend' // Must be at the top
import { z } from 'zod'

// Schema references
export const destinationPortIdRef = 'DestinationPortId'
export const destinationPortTypeRef = 'DestinationPortType'
export const destinationPortChannelRef = 'DestinationPortChannel'
export const destinationPortDescriptionRef = 'DestinationPortDescription'
export const destinationPortResponseRef = 'DestinationPortResponse'

// Base schemas
export const destinationPortIdSchema = z.string().uuid().openapi({
	description: 'A UUIDv4 identifier for a destination port',
	example: '83824df7-2831-4ed9-a711-ea1a4bfb4f38',
})

export const destinationPortTypeSchema = z.string().min(1).openapi({
	description: 'The type of the destination port (e.g., video, audio)',
	example: 'audio',
})

export const destinationPortChannelSchema = z.number().int().min(1).openapi({
	description: 'The channel number of the destination port',
	example: 1,
})

export const destinationPortDescriptionSchema = z.string().optional().openapi({
	description: 'Optional description of the destination port',
	example: 'Main audio output',
})

// Destination port schema
export const destinationPortSchema = z.object({
	id: destinationPortIdSchema,
	type: destinationPortTypeSchema,
	channel: destinationPortChannelSchema,
	description: destinationPortDescriptionSchema,
})

// Schema for path parameters for /destination-ports/{destinationPortId}
export const destinationPortPathParamsSchema = z.object({
	destinationPortId: destinationPortIdSchema,
})

// Schema for the request body for POST /destination-ports
export const destinationPortPostRequestBodySchema = z.object({
	type: destinationPortTypeSchema,
	channel: destinationPortChannelSchema,
	description: destinationPortDescriptionSchema,
	destinationId: z.string().uuid(),
})

// Schema for the request body for PUT /destination-ports/{destinationPortId}
export const destinationPortPutRequestBodySchema = z.object({
	type: destinationPortTypeSchema,
	channel: destinationPortChannelSchema,
	description: destinationPortDescriptionSchema,
})

// Schema for the request body for PATCH /destination-ports/{destinationPortId}
export const destinationPortPatchRequestBodySchema = z.object({
	type: destinationPortTypeSchema.optional(),
	channel: destinationPortChannelSchema.optional(),
	description: destinationPortDescriptionSchema,
})

// Validation function to ensure at least one field is provided
export const validateDestinationPortPatch = (data: z.infer<typeof destinationPortPatchRequestBodySchema>): boolean => {
	return Object.keys(data).length > 0
}

// Schema for a successful response concerning a destination port
export const destinationPortSuccessResponseSchema = z
	.object({
		id: destinationPortIdSchema,
		type: destinationPortTypeSchema,
		channel: destinationPortChannelSchema,
		description: destinationPortDescriptionSchema,
		destinationId: z.string().uuid(),
		createdAt: z.string().datetime().openapi({
			description: 'The date and time when the destination port was created',
			example: '2023-01-01T12:00:00Z',
		}),
		updatedAt: z.string().datetime().openapi({
			description: 'The date and time when the destination port was last updated',
			example: '2023-01-01T12:00:00Z',
		}),
	})
	.openapi({ ref: destinationPortResponseRef })

// Schema for a list of destination ports
export const destinationPortListSuccessResponseSchema = z
	.array(destinationPortSuccessResponseSchema)
	.openapi({ ref: 'DestinationPortListResponse' })
