import type { RouteConfig } from '../../utils/route-helpers'
import { sourcePathParamsSchema, notFoundSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the DELETE /sources/:sourceId route
export const deleteSourceRoute: RouteConfig<typeof sourcePathParamsSchema, undefined, undefined> = {
	method: 'delete',
	path: '/sources/:sourceId',
	openapi: {
		summary: 'Delete a source',
		tags: ['Sources'],
		requestParams: {
			path: sourcePathParamsSchema,
		},
		responses: {
			'204': {
				description: 'No Content - Successfully deleted source',
			},
			'400': {
				description: 'Bad Request - Invalid source ID format',
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
	},
	handler: async (req, res, next) => {
		const { sourceId } = req.validatedParams
		console.log(`HANDLER: Deleting source ${sourceId}`)

		try {
			const source = await prisma.source.delete({
				where: { id: sourceId },
			})

			// Return 204 No Content for successful deletion
			res.status(204).end()
		} catch (error) {
			console.error('Error deleting source:', error)

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
