import type { RouteConfig } from '../../utils/route-helpers'
import { flowEdgeListSuccessResponseSchema } from '../../schemas/flow-edge'
import { errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the GET /flow-edges route
export const listFlowEdges: RouteConfig<undefined, undefined, undefined> = {
	method: 'get',
	path: '/flow-edges',
	openapi: {
		summary: 'List all flow edges',
		tags: ['Flow Edges'],
		responses: {
			'200': {
				description: 'OK - Successfully retrieved flow edges',
				content: {
					'application/json': { schema: flowEdgeListSuccessResponseSchema },
				},
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {},
	handler: async (req, res, next) => {
		console.log('HANDLER: Listing all flow edges')

		try {
			// Get all flow edges
			const flowEdges = await prisma.flowEdge.findMany()

			// Format the response according to our schema
			const responsePayload = flowEdges.map((flowEdge) => ({
				id: flowEdge.id,
				sourcePortId: flowEdge.sourcePortId,
				destinationPortId: flowEdge.destinationPortId,
				createdAt: flowEdge.createdAt.toISOString(),
				updatedAt: flowEdge.updatedAt.toISOString(),
			}))

			res.status(200).json(flowEdgeListSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error listing flow edges:', error)
			next(error)
		}
	},
}
