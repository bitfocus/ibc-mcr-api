import type { RouteConfig } from '../../utils/route-helpers'
import { flowEdgePostRequestBodySchema, flowEdgeSuccessResponseSchema } from '../../schemas/flow-edge'
import { errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the POST /flow-edges route
export const createFlowEdge: RouteConfig<undefined, undefined, typeof flowEdgePostRequestBodySchema> = {
	method: 'post',
	path: '/flow-edges',
	openapi: {
		summary: 'Create a new flow edge',
		tags: ['Flow Edges'],
		requestBody: {
			content: {
				'application/json': { schema: flowEdgePostRequestBodySchema },
			},
		},
		responses: {
			'201': {
				description: 'Created - Successfully created flow edge',
				content: {
					'application/json': { schema: flowEdgeSuccessResponseSchema },
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
		body: flowEdgePostRequestBodySchema,
	},
	handler: async (req, res, next) => {
		const { sourcePortId, destinationPortId } = req.validatedBody
		console.log(`HANDLER: Creating flow edge from source port "${sourcePortId}" to destination port "${destinationPortId}"`)

		try {
			// Verify that the source port exists
			const sourcePort = await prisma.sourcePort.findUnique({
				where: { id: sourcePortId },
			})

			if (!sourcePort) {
				res.status(400).json({
					message: 'Source port not found',
				})
				return
			}

			// Verify that the destination port exists
			const destinationPort = await prisma.destinationPort.findUnique({
				where: { id: destinationPortId },
			})

			if (!destinationPort) {
				res.status(400).json({
					message: 'Destination port not found',
				})
				return
			}

			// Get the event ID from the source port
			const source = await prisma.source.findUnique({
				where: { id: sourcePort.sourceId },
			})

			if (!source) {
				res.status(400).json({
					message: 'Source not found',
				})
				return
			}

			// Create the flow edge
			const flowEdge = await prisma.flowEdge.create({
				data: {
					sourcePortId,
					destinationPortId,
				},
			})

			// Format the response according to our schema
			const responsePayload = {
				id: flowEdge.id,
				sourcePortId: flowEdge.sourcePortId,
				destinationPortId: flowEdge.destinationPortId,
				createdAt: flowEdge.createdAt.toISOString(),
				updatedAt: flowEdge.updatedAt.toISOString(),
			}

			res.status(201).json(flowEdgeSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error creating flow edge:', error)
			next(error)
		}
	},
}
