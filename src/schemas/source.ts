import 'zod-openapi/extend' // Must be at the top
import { z } from 'zod'
import { eventIdSchema, sourceIdSchema, sourceLabelSchema } from './event'

// Schema references
export const sourceResponseRef = 'SourceResponse'
export const sourceListResponseRef = 'SourceListResponse'

// Schema for path parameters for /sources/{sourceId}
export const sourcePathParamsSchema = z.object({
	sourceId: sourceIdSchema,
})

// Schema for the request body for POST /sources
export const sourcePostRequestBodySchema = z.object({
	label: sourceLabelSchema,
	eventId: eventIdSchema,
})

// Schema for the request body for PUT /sources/{sourceId}
export const sourcePutRequestBodySchema = z.object({
	label: sourceLabelSchema,
	eventId: eventIdSchema,
})

// Schema for the request body for PATCH /sources/{sourceId}
export const sourcePatchRequestBodySchema = z.object({
	label: sourceLabelSchema.optional(),
	eventId: eventIdSchema.optional(),
})

// Validation function to ensure at least one field is provided
export const validateSourcePatch = (data: z.infer<typeof sourcePatchRequestBodySchema>): boolean => {
	return Object.keys(data).length > 0
}

// Schema for a successful response concerning a source
export const sourceSuccessResponseSchema = z
	.object({
		id: sourceIdSchema,
		label: sourceLabelSchema,
		eventId: eventIdSchema,
		createdAt: z.string().datetime().openapi({
			description: 'The date and time when the source was created',
			example: '2023-01-01T12:00:00Z',
		}),
		updatedAt: z.string().datetime().openapi({
			description: 'The date and time when the source was last updated',
			example: '2023-01-01T12:00:00Z',
		}),
	})
	.openapi({ ref: sourceResponseRef })

// Schema for a list of sources
export const sourceListSuccessResponseSchema = z
	.array(sourceSuccessResponseSchema)
	.openapi({ ref: sourceListResponseRef })
