import type { RouteConfig } from '../../utils/route-helpers'
import { sourcePortPathParamsSchema, notFoundSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the DELETE /source-ports/:sourcePortId route
export const deleteSourcePortRoute: RouteConfig<typeof sourcePortPathParamsSchema, undefined, undefined> = {
	method: 'delete',
	path: '/source-ports/:sourcePortId',
	openapi: {
		summary: 'Delete a source port by ID',
		tags: ['Source Ports'],
		requestParams: {
			path: sourcePortPathParamsSchema,
		},
		responses: {
			'204': {
				description: 'No Content - Successfully deleted source port',
			},
			'400': {
				description: 'Bad Request - Invalid source port ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Source port not found',
				content: { 'application/json': { schema: notFoundSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: sourcePortPathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { sourcePortId } = req.validatedParams
		console.log(`HANDLER: Deleting source port ${sourcePortId}`)

		try {
			// Check if the source port exists
			const existingSourcePort = await prisma.sourcePort.findUnique({
				where: { id: sourcePortId },
			})

			if (!existingSourcePort) {
				res.status(404).json(
					notFoundSchema.parse({
						message: `Source port with ID ${sourcePortId} not found`,
					}),
				)
				return
			}

			// Check if there are any flow edges connected to this source port
			const connectedFlowEdges = await prisma.flowEdge.findMany({
				where: { sourcePortId },
			})

			if (connectedFlowEdges.length > 0) {
				// Delete all connected flow edges first
				await prisma.flowEdge.deleteMany({
					where: { sourcePortId },
				})
				console.log(`Deleted ${connectedFlowEdges.length} flow edges connected to source port ${sourcePortId}`)
			}

			// Delete the source port using Prisma
			await prisma.sourcePort.delete({
				where: { id: sourcePortId },
			})

			// Return 204 No Content for successful deletion
			res.status(204).end()
		} catch (error) {
			console.error('Error deleting source port:', error)
			next(error)
		}
	},
}
