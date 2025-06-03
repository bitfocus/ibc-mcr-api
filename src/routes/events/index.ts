// Export all event routes
import { getEventRoute } from './get-event'
import { updateEventRoute } from './update-event'
import { patchEventRoute } from './patch-event'
import { createEventRoute } from './create-event'
import { deleteEventRoute } from './delete-event'
import { listEventsRoute } from './list-events'

export const eventRoutes = [
	getEventRoute,
	listEventsRoute,
	createEventRoute,
	updateEventRoute,
	patchEventRoute,
	deleteEventRoute,
]
