import type { RouteConfig } from '../../utils/route-helpers'
import { sourcePortListSuccessResponseSchema, errorSchema } from '../../schemas'
import { sourceIdSchema } from '../../schemas/event'
import { z } from 'zod'
import { prisma } from '../../utils/prisma'

// Schema for path parameters
const sourcePortsPathParamsSchema = z.object({
	sourceId: sourceIdSchema,
})

// Define the GET /source-ports/by-source/:sourceId route
export const listSourcePortsBySourceRoute: RouteConfig<typeof sourcePortsPathParamsSchema, undefined, undefined> = {
	method: 'get',
	path: '/source-ports/by-source/:sourceId',
	openapi: {
		summary: 'List all source ports for a specific source',
		tags: ['Source Ports'],
		requestParams: {
			path: sourcePortsPathParamsSchema,
		},
		responses: {
			'200': {
				description: 'OK - Successfully retrieved source ports',
				content: {
					'application/json': { schema: sourcePortListSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid Source ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: sourcePortsPathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { sourceId } = req.validatedParams
		console.log(`HANDLER: Listing source ports for source ${sourceId}`)

		try {
			// Check if the source exists
			const source = await prisma.source.findUnique({
				where: { id: sourceId },
			})

			if (!source) {
				res.status(400).json({
					message: `Source with ID ${sourceId} not found`,
				})
				return
			}

			// Find all source ports for the specified source
			const sourcePorts = await prisma.sourcePort.findMany({
				where: { sourceId },
			})

			// Format dates as ISO strings for the response
			const response = sourcePorts.map((port) => ({
				...port,
				createdAt: port.createdAt instanceof Date ? port.createdAt.toISOString() : port.createdAt,
				updatedAt: port.updatedAt instanceof Date ? port.updatedAt.toISOString() : port.updatedAt,
			}))

			res.status(200).json(sourcePortListSuccessResponseSchema.parse(response))
		} catch (error) {
			console.error('Error listing source ports:', error)
			next(error)
		}
	},
}
