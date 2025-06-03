import type { RouteConfig } from '../../utils/route-helpers'
import { eventPathParamsSchema, eventSuccessResponseSchema, notFoundSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the GET /events/:eventId route
export const getEventRoute: RouteConfig<typeof eventPathParamsSchema, undefined, undefined> = {
	method: 'get',
	path: '/events/:eventId',
	openapi: {
		summary: 'Get an event by ID',
		tags: ['Events'],
		requestParams: {
			path: eventPathParamsSchema,
		},
		responses: {
			'200': {
				description: 'OK - Successfully retrieved event',
				content: {
					'application/json': { schema: eventSuccessResponseSchema },
				},
			},
			'400': {
				// For invalid UUID format passed in path
				description: 'Bad Request - Invalid Event ID format',
				content: { 'application/json': { schema: errorSchema } },
			},
			'404': {
				description: 'Not Found - Event not found',
				content: { 'application/json': { schema: notFoundSchema } },
			},
		},
	},
	validationSchemas: {
		params: eventPathParamsSchema,
	},
	handler: async (req, res, next) => {
		const { eventId } = req.validatedParams
		console.log(`HANDLER: Fetching event ${eventId}`)

		try {
			// Try to find the event using Prisma
			const event = await prisma.event.findUnique({
				where: { id: eventId },
				include: {
					sources: {
						include: {
							ports: true,
						},
					},
					destinations: {
						include: {
							ports: true,
						},
					},
					partylines: true,
				},
			})

			// Check if the event exists
			if (!event) {
				res.status(404).json(
					notFoundSchema.parse({
						message: `Event with ID ${eventId} not found`,
					}),
				)
				return
			}

			// Fetch flow edges for this event
			const flowEdges = await prisma.flowEdge.findMany({
				where: {
					sourcePort: {
						source: {
							eventId: eventId,
						},
					},
				},
				include: {
					sourcePort: true,
					destinationPort: true,
				},
			})

			// Format the response using the actual event data
			const responsePayload = {
				id: event.id,
				title: event.title,
				createdAt: event.createdAt.toISOString(),
				updatedAt: event.updatedAt.toISOString(),
				sources:
					event.sources?.map((source) => ({
						id: source.id,
						label: source.label,
						ports:
							source.ports?.map((port) => ({
								id: port.id,
								type: port.type,
								channel: port.channel,
								description: port.description,
							})) || [],
					})) || [],
				destinations:
					event.destinations?.map((destination) => ({
						id: destination.id,
						label: destination.label,
						ports:
							destination.ports?.map((port) => ({
								id: port.id,
								type: port.type,
								channel: port.channel,
								description: port.description,
							})) || [],
					})) || [],
				partylines:
					event.partylines?.map((partyline) => ({
						id: partyline.id,
						title: partyline.title,
					})) || [],
				flowEdges: flowEdges.map((edge) => ({
					id: edge.id,
					sourcePortId: edge.sourcePortId,
					destinationPortId: edge.destinationPortId,
					sourcePort: {
						id: edge.sourcePort.id,
						type: edge.sourcePort.type,
						channel: edge.sourcePort.channel,
						description: edge.sourcePort.description,
					},
					destinationPort: {
						id: edge.destinationPort.id,
						type: edge.destinationPort.type,
						channel: edge.destinationPort.channel,
						description: edge.destinationPort.description,
					},
				})),
			}

			res.status(200).json(eventSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error fetching event:', error)
			next(error)
		}
	},
}
