import type { RouteConfig } from '../../utils/route-helpers'
import { flowEdgePathParamsSchema, flowEdgeSuccessResponseSchema } from '../../schemas/flow-edge'
import { errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the GET /flow-edges/{flowEdgeId} route
export const getFlowEdge: RouteConfig<typeof flowEdgePathParamsSchema, undefined, undefined> = {
	method: 'get',
	path: '/flow-edges/{flowEdgeId}',
	openapi: {
		summary: 'Get a flow edge by ID',
		tags: ['Flow Edges'],
		requestParams: {
			path: flowEdgePathParamsSchema,
		},
		responses: {
			'200': {
				description: 'OK - Successfully retrieved flow edge',
				content: {
					'application/json': { schema: flowEdgeSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid Flow Edge ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Flow Edge not found',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: flowEdgePathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { flowEdgeId } = req.validatedParams
		console.log(`HANDLER: Getting flow edge with ID "${flowEdgeId}"`)

		try {
			// Find the flow edge by ID
			const flowEdge = await prisma.flowEdge.findUnique({
				where: { id: flowEdgeId },
			})

			if (!flowEdge) {
				res.status(404).json({
					message: 'Flow edge not found',
				})
				return
			}

			// Format the response according to our schema
			const responsePayload = {
				id: flowEdge.id,
				sourcePortId: flowEdge.sourcePortId,
				destinationPortId: flowEdge.destinationPortId,
				createdAt: flowEdge.createdAt.toISOString(),
				updatedAt: flowEdge.updatedAt.toISOString(),
			}

			res.status(200).json(flowEdgeSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error getting flow edge:', error)
			next(error)
		}
	},
}
