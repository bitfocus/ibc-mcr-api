import type { RouteConfig } from "../../utils/route-helpers";
import { eventListSuccessResponseSchema, errorSchema } from "../../schemas";
import { prisma } from "utils/prisma";

// Define the GET /events route
export const listEventsRoute: RouteConfig<undefined, undefined, undefined> = {
	method: "get",
	path: "/events",
	openapi: {
		summary: "List all events",
		tags: ["Events"],
		responses: {
			"200": {
				description: "OK - Successfully retrieved events",
				content: {
					"application/json": { schema: eventListSuccessResponseSchema },
				},
			},
			"500": {
				description: "Internal Server Error",
				content: { "application/json": { schema: errorSchema } },
			},
		},
	},
	validationSchemas: {},
	handler: async (req, res, next) => {
		console.log("HANDLER: Listing all events");

		try {
			// Fetch all events using Prisma


			const dbEvents = await prisma.event.findMany({
				include: {
					sources: true,
					destinations: true,
				},
			});

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
					})) || [],
				destinations:
					event.destinations?.map((destination) => ({
						id: destination.id,
						label: destination.label,
					})) || [],
			}));

			res.status(200).json(eventListSuccessResponseSchema.parse(events));
		} catch (error) {
			console.error("Error listing events:", error);
			next(error);
		}
	},
};
