import type { RouteConfig } from '../../utils/route-helpers'
import { sourcePostRequestBodySchema, sourceSuccessResponseSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the POST /sources route
export const createSourceRoute: RouteConfig<undefined, undefined, typeof sourcePostRequestBodySchema> = {
	method: 'post',
	path: '/sources',
	openapi: {
		summary: 'Create a new source',
		tags: ['Sources'],
		requestBody: {
			content: {
				'application/json': { schema: sourcePostRequestBodySchema },
			},
		},
		responses: {
			'201': {
				description: 'Created - Successfully created source',
				content: {
					'application/json': { schema: sourceSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid request body',
				content: { 'application/json': { schema: errorSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		body: sourcePostRequestBodySchema,
	},
	handler: async (req, res, next) => {
		const { label, eventId } = req.validatedBody
		console.log(`HANDLER: Creating source with label "${label}" for event ${eventId}`)

		try {
			const source = await prisma.source.create({
				data: {
					label,
					eventId,
				},
			})

			// Format dates as ISO strings for the response
			const response = {
				...source,
				createdAt: source.createdAt instanceof Date ? source.createdAt.toISOString() : source.createdAt,
				updatedAt: source.updatedAt instanceof Date ? source.updatedAt.toISOString() : source.updatedAt,
			}

			res.status(201).json(sourceSuccessResponseSchema.parse(response))
		} catch (error) {
			console.error('Error creating source:', error)
			next(error)
		}
	},
}
