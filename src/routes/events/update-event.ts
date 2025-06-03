import type { RouteConfig } from '../../utils/route-helpers'
import {
	eventPathParamsSchema,
	eventPutRequestBodySchema,
	eventSuccessResponseSchema,
	notFoundSchema,
	errorSchema,
} from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the PUT /events/:eventId route
export const updateEventRoute: RouteConfig<typeof eventPathParamsSchema, undefined, typeof eventPutRequestBodySchema> =
	{
		method: 'put',
		path: '/events/:eventId',
		openapi: {
			summary: 'Update an event',
			tags: ['Events'],
			requestParams: {
				path: eventPathParamsSchema,
			},
			requestBody: {
				content: {
					'application/json': { schema: eventPutRequestBodySchema },
				},
			},
			responses: {
				'200': {
					description: 'OK - Event updated successfully',
					content: {
						'application/json': { schema: eventSuccessResponseSchema },
					},
				},
				'400': {
					description: 'Bad Request - Invalid input',
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
			body: eventPutRequestBodySchema,
		},
		handler: async (req, res, next) => {
			const { eventId } = req.validatedParams
			const { title, sources, destinations } = req.validatedBody

			console.log(`HANDLER: Updating event ${eventId} with title: "${title}"`)

			try {
				// First check if the event exists

				const existingEvent = await prisma.event.findUnique({
					where: { id: eventId },
				})

				if (!existingEvent) {
					res.status(404).json(
						notFoundSchema.parse({
							message: `Event with ID ${eventId} not found`,
						}),
					)
					return
				}

				// Update the event using Prisma

				const event = await prisma.event.update({
					where: { id: eventId },
					data: {
						title,
						// In a real implementation, you would handle sources and destinations
						// by connecting/disconnecting them based on the provided arrays
					},
					include: {
						sources: true,
						destinations: true,
					},
				})

				// Format the response according to our schema
				const responsePayload = {
					id: event.id,
					title: event.title,
					createdAt: event.createdAt.toISOString(),
					updatedAt: event.updatedAt.toISOString(),
					sources:
						event.sources?.map((source) => ({
							id: source.id,
							label: source.label,
						})) || [],
					destinations:
						event.destinations?.map((destination) => ({
							id: destination.id,
							label: destination.label,
						})) || [],
				}

				res.status(200).json(eventSuccessResponseSchema.parse(responsePayload))
			} catch (error) {
				console.error('Error updating event:', error)
				next(error)
			}
		},
	}
