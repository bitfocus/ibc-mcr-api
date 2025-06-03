import 'zod-openapi/extend' // Must be at the top
import { z } from 'zod'

// Common schema references
export const errorResponseRef = 'ErrorResponse'
export const notFoundResponseRef = 'NotFoundResponse'

// Generic error response schema
export const errorSchema = z
	.object({
		message: z.string().openapi({ example: 'Validation failed' }),
		errors: z
			.record(z.array(z.string()))
			.optional()
			.openapi({
				example: { fieldName: ['Error message 1', 'Error message 2'] },
			}),
	})
	.openapi({ ref: errorResponseRef })

// Not found response schema
export const notFoundSchema = z
	.object({
		message: z.string().openapi({ example: 'Resource not found' }),
	})
	.openapi({ ref: notFoundResponseRef })
