import type { RouteConfig } from '../../utils/route-helpers'
import { flowEdgePathParamsSchema } from '../../schemas/flow-edge'
import { errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the DELETE /flow-edges/{flowEdgeId} route
export const deleteFlowEdge: RouteConfig<typeof flowEdgePathParamsSchema, undefined, undefined> = {
	method: 'delete',
	path: '/flow-edges/{flowEdgeId}',
	openapi: {
		summary: 'Delete a flow edge by ID',
		tags: ['Flow Edges'],
		requestParams: {
			path: flowEdgePathParamsSchema,
		},
		responses: {
			'204': {
				description: 'No Content - Successfully deleted flow edge',
			},
			'400': {
				description: 'Bad Request - Invalid flow edge ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Flow edge not found',
				content: { 'application/json': { schema: errorSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: flowEdgePathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { flowEdgeId } = req.validatedParams
		console.log(`HANDLER: Deleting flow edge with ID "${flowEdgeId}"`)

		try {
			// Check if the flow edge exists
			const existingFlowEdge = await prisma.flowEdge.findUnique({
				where: { id: flowEdgeId },
			})

			if (!existingFlowEdge) {
				res.status(404).json({
					message: 'Flow edge not found',
				})
				return
			}

			// Delete the flow edge
			await prisma.flowEdge.delete({
				where: { id: flowEdgeId },
			})

			// Return 204 No Content for successful deletion
			res.status(204).end()
		} catch (error) {
			console.error('Error deleting flow edge:', error)
			next(error)
		}
	},
}
