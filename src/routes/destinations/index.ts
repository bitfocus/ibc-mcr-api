import { getDestinationRoute } from './get-destination'
import { createDestinationRoute } from './create-destination'
import { putDestinationRoute, patchDestinationRoute } from './update-destination'
import { deleteDestinationRoute } from './delete-destination'
// Removed list-destinations route as we'll access destinations through events

// Export all destination routes
export const destinationRoutes = [
	getDestinationRoute,
	createDestinationRoute,
	putDestinationRoute,
	patchDestinationRoute,
	deleteDestinationRoute,
	// listDestinationsRoute removed
]
