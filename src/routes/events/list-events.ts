import type { RouteConfig } from '../../utils/route-helpers'
import { eventListSuccessResponseSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the GET /events route
export const listEventsRoute: RouteConfig<undefined, undefined, undefined> = {
	method: 'get',
	path: '/events',
	openapi: {
		summary: 'List all events',
		tags: ['Events'],
		responses: {
			'200': {
				description: 'OK - Successfully retrieved events',
				content: {
					'application/json': { schema: eventListSuccessResponseSchema },
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
		console.log('HANDLER: Listing all events')

		try {
			// Fetch all events using Prisma
			const dbEvents = await prisma.event.findMany({
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

			// Fetch flow edges for all events
			const eventIds = dbEvents.map((event) => event.id)
			const flowEdges = await prisma.flowEdge.findMany({
				where: {
					sourcePort: {
						source: {
							eventId: {
								in: eventIds,
							},
						},
					},
				},
				include: {
					sourcePort: {
						include: {
							source: true,
						},
					},
					destinationPort: true,
				},
			})

			// Group flow edges by event ID for easier lookup
			const flowEdgesByEventId = flowEdges.reduce(
				(acc, edge) => {
					const eventId = edge.sourcePort.source.eventId
					if (!acc[eventId]) {
						acc[eventId] = []
					}
					acc[eventId].push(edge)
					return acc
				},
				{} as Record<string, typeof flowEdges>,
			)

			// Format the events for the response
			const events = dbEvents.map((event) => ({
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
				flowEdges: (flowEdgesByEventId[event.id] || []).map((edge) => ({
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
			}))

			res.status(200).json(eventListSuccessResponseSchema.parse(events))
		} catch (error) {
			console.error('Error listing events:', error)
			next(error)
		}
	},
}
