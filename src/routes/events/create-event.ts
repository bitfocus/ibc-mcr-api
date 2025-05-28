import type { RouteConfig } from "../../utils/route-helpers";
import {
	eventPostRequestBodySchema,
	eventSuccessResponseSchema,
	errorSchema,
} from "../../schemas";
import { prisma } from "utils/prisma";

// Define the POST /events route
export const createEventRoute: RouteConfig<
	undefined,
	undefined,
	typeof eventPostRequestBodySchema
> = {
	method: "post",
	path: "/events",
	openapi: {
		summary: "Create a new event",
		tags: ["Events"],
		requestBody: {
			content: {
				"application/json": { schema: eventPostRequestBodySchema },
			},
		},
		responses: {
			"201": {
				description: "Created - Successfully created event",
				content: {
					"application/json": { schema: eventSuccessResponseSchema },
				},
			},
			"400": {
				description: "Bad Request - Invalid request body",
				content: { "application/json": { schema: errorSchema } },
			},
			"500": {
				description: "Internal Server Error",
				content: { "application/json": { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {
		body: eventPostRequestBodySchema,
	},
	handler: async (req, res, next) => {
		const { title } = req.validatedBody;
		console.log(`HANDLER: Creating event with title "${title}"`);

		try {
			// Create a new event using Prisma

			const event = await prisma.event.create({
				data: {
					title,
				},
				include: {
					sources: true,
					destinations: true,
				},
			});

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
			};

			res.status(201).json(eventSuccessResponseSchema.parse(responsePayload));
		} catch (error) {
			console.error("Error creating event:", error);
			next(error);
		}
	},
};
