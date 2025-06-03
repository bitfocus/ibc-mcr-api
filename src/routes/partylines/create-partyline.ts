import type { RouteConfig } from '../../utils/route-helpers'
import { partylinePostRequestBodySchema, partylineSuccessResponseSchema, errorSchema } from '../../schemas'
import { prisma } from '../../utils/prisma'

// Define the POST /partylines route
export const createPartylineRoute: RouteConfig<undefined, undefined, typeof partylinePostRequestBodySchema> = {
	method: 'post',
	path: '/partylines',
	openapi: {
		summary: 'Create a new partyline',
		tags: ['Partylines'],
		requestBody: {
			content: {
				'application/json': { schema: partylinePostRequestBodySchema },
			},
		},
		responses: {
			'201': {
				description: 'Created - Successfully created partyline',
				content: {
					'application/json': { schema: partylineSuccessResponseSchema },
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
		body: partylinePostRequestBodySchema,
	},
	handler: async (req, res, next) => {
		const { title, eventId } = req.validatedBody
		console.log(`HANDLER: Creating partyline "${title}" for event ${eventId}`)

		try {
			// Check if the event exists
			const event = await prisma.event.findUnique({
				where: { id: eventId },
			})

			if (!event) {
				res.status(400).json({
					message: `Event with ID ${eventId} not found`,
				})
				return
			}

			// Create the partyline using Prisma
			const partyline = await prisma.partyline.create({
				data: {
					title,
					event: {
						connect: { id: eventId },
					},
				},
			})

			// Format the response
			const responsePayload = {
				id: partyline.id,
				title: partyline.title,
				eventId: partyline.eventId,
				createdAt: partyline.createdAt.toISOString(),
				updatedAt: partyline.updatedAt.toISOString(),
			}

			res.status(201).json(partylineSuccessResponseSchema.parse(responsePayload))
		} catch (error) {
			console.error('Error creating partyline:', error)
			next(error)
		}
	},
}
