import type { RouteConfig } from '../../utils/route-helpers'
import { partylinePathParamsSchema, partylineSuccessResponseSchema, notFoundSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the GET /partylines/:partylineId route
export const getPartylineRoute: RouteConfig<typeof partylinePathParamsSchema, undefined, undefined> = {
	method: 'get',
	path: '/partylines/:partylineId',
	openapi: {
		summary: 'Get a partyline by ID',
		tags: ['Partylines'],
		requestParams: {
			path: partylinePathParamsSchema,
		},
		responses: {
			'200': {
				description: 'OK - Successfully retrieved partyline',
				content: {
					'application/json': { schema: partylineSuccessResponseSchema },
				},
			},
			'400': {
				description: 'Bad Request - Invalid Partyline ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Partyline not found',
				content: { 'application/json': { schema: notFoundSchema } },
			},
		},
	},
	validationSchemas: {
		params: partylinePathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { partylineId } = req.validatedParams
		console.log(`HANDLER: Fetching partyline ${partylineId}`)

		try {
			// Try to find the partyline using Prisma
			const partyline = await prisma.partyline.findUnique({
				where: { id: partylineId },
			})

			// Check if the partyline exists
			if (!partyline) {
				res.status(404).json(
					notFoundSchema.parse({
						message: `Partyline with ID ${partylineId} not found`,
					}),
				)
				return
			}

			// Format the response using the actual partyline data
			const responsePayload = {
				id: partyline.id,
				title: partyline.title,
				eventId: partyline.eventId,
				createdAt: partyline.createdAt.toISOString(),
				updatedAt: partyline.updatedAt.toISOString(),
			}

			res.status(200).json(partylineSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error fetching partyline:', error)
			next(error)
		}
	},
}
