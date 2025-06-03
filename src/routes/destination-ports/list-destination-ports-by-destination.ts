import type { RouteConfig } from '../../utils/route-helpers'
import { destinationPortListSuccessResponseSchema, errorSchema } from '../../schemas'
import { destinationIdSchema } from '../../schemas/event'
import { z } from 'zod'
import { prisma } from '../../utils/prisma'

// Schema for path parameters
const destinationPortsPathParamsSchema = z.object({
	destinationId: destinationIdSchema,
})

// Define the GET /destination-ports/by-destination/:destinationId route
export const listDestinationPortsByDestinationRoute: RouteConfig<typeof destinationPortsPathParamsSchema, undefined, undefined> = {
	method: 'get',
	path: '/destination-ports/by-destination/:destinationId',
	openapi: {
		summary: 'List all destination ports for a specific destination',
		tags: ['Destination Ports'],
		requestParams: {
			path: destinationPortsPathParamsSchema,
		},
		responses: {
			'200': {
				description: 'OK - Successfully retrieved destination ports',
				content: {
					'application/json': { schema: destinationPortListSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid Destination ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'500': {
				description: 'Internal Server Error',
				content: { 'application/json': { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		params: destinationPortsPathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { destinationId } = req.validatedParams
		console.log(`HANDLER: Listing destination ports for destination ${destinationId}`)

		try {
			// Check if the destination exists
			const destination = await prisma.destination.findUnique({
				where: { id: destinationId },
			})

			if (!destination) {
				res.status(400).json({
					message: `Destination with ID ${destinationId} not found`,
				})
				return
			}

			// Find all destination ports for the specified destination
			const destinationPorts = await prisma.destinationPort.findMany({
				where: { destinationId },
			})

			// Format dates as ISO strings for the response
			const response = destinationPorts.map((port) => ({
				...port,
				createdAt: port.createdAt instanceof Date ? port.createdAt.toISOString() : port.createdAt,
				updatedAt: port.updatedAt instanceof Date ? port.updatedAt.toISOString() : port.updatedAt,
			}))

			res.status(200).json(destinationPortListSuccessResponseSchema.parse(response))
		} catch (error) {
			console.error('Error listing destination ports:', error)
			next(error)
		}
	},
}
