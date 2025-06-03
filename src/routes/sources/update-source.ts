import type { RouteConfig } from '../../utils/route-helpers'
import {
	sourcePathParamsSchema,
	sourcePutRequestBodySchema,
	sourcePatchRequestBodySchema,
	sourceSuccessResponseSchema,
	notFoundSchema,
	errorSchema,
	validateSourcePatch,
} from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the PUT /sources/:sourceId route
export const putSourceRoute: RouteConfig<typeof sourcePathParamsSchema, undefined, typeof sourcePutRequestBodySchema> =
	{
		method: 'put',
		path: '/sources/:sourceId',
		openapi: {
			summary: 'Replace a source',
			tags: ['Sources'],
			requestParams: {
				path: sourcePathParamsSchema,
			},
			requestBody: {
				content: {
					'application/json': { schema: sourcePutRequestBodySchema },
				},
			},
			responses: {
				'200': {
					description: 'OK - Successfully updated source',
					content: {
						'application/json': { schema: sourceSuccessResponseSchema },
					},
				},
				'400': {
					description: 'Bad Request - Invalid request body or source ID',
					content: { 'application/json': { schema: errorSchema } },
				},
				'404': {
					description: 'Not Found - Source not found',
					content: { 'application/json': { schema: notFoundSchema } },
				},
				'500': {
					description: 'Internal Server Error',
					content: { 'application/json': { schema: errorSchema } },
				},
			},
		},
		validationSchemas: {
			params: sourcePathParamsSchema,
			body: sourcePutRequestBodySchema,
		},
		handler: async (req, res, next) => {
			const { sourceId } = req.validatedParams
			const { label, eventId } = req.validatedBody
			console.log(`HANDLER: Updating source ${sourceId}`)

			try {
				const source = await prisma.source.update({
					where: { id: sourceId },
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

				res.status(200).json(sourceSuccessResponseSchema.parse(response))
			} catch (error) {
				console.error('Error updating source:', error)

				// Check if it's a "not found" error
				if (error instanceof Error && error.message.includes('not found')) {
					res.status(404).json(
						notFoundSchema.parse({
							message: `Source with ID ${sourceId} not found`,
						}),
					)
					return
				}

				next(error)
			}
		},
	}

// Define the PATCH /sources/:sourceId route
export const patchSourceRoute: RouteConfig<
	typeof sourcePathParamsSchema,
	undefined,
	typeof sourcePatchRequestBodySchema
> = {
	method: 'patch',
	path: '/sources/:sourceId',
	openapi: {
		summary: 'Update a source partially',
		tags: ['Sources'],
		requestParams: {
			path: sourcePathParamsSchema,
		},
		requestBody: {
			content: {
				'application/json': { schema: sourcePatchRequestBodySchema },
			},
		},
		responses: {
			'200': {
				description: 'OK - Successfully updated source',
				content: {
					'application/json': { schema: sourceSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid request body or source ID',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Source not found',
				content: { 'application/json': { schema: notFoundSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: sourcePathParamsSchema,
		body: sourcePatchRequestBodySchema,
	},
	handler: async (req, res, next) => {
		const { sourceId } = req.validatedParams
		const updateData = req.validatedBody
		console.log(`HANDLER: Partially updating source ${sourceId}`)

		// Validate that at least one field is provided
		if (!validateSourcePatch(updateData)) {
			res.status(400).json(
				errorSchema.parse({
					message: 'At least one field must be provided for update',
				}),
			)
			return
		}

		try {
			const source = await prisma.source.update({
				where: { id: sourceId },
				data: updateData,
			})

			// Format dates as ISO strings for the response
			const response = {
				...source,
				createdAt: source.createdAt instanceof Date ? source.createdAt.toISOString() : source.createdAt,
				updatedAt: source.updatedAt instanceof Date ? source.updatedAt.toISOString() : source.updatedAt,
			}

			res.status(200).json(sourceSuccessResponseSchema.parse(response))
		} catch (error) {
			console.error('Error updating source:', error)

			// Check if it's a "not found" error
			if (error instanceof Error && error.message.includes('not found')) {
				res.status(404).json(
					notFoundSchema.parse({
						message: `Source with ID ${sourceId} not found`,
					}),
				)
				return
			}

			next(error)
		}
	},
}
