import { getDestinationPortRoute } from './get-destination-port'
import { createDestinationPortRoute } from './create-destination-port'
import { putDestinationPortRoute, patchDestinationPortRoute } from './update-destination-port'
import { deleteDestinationPortRoute } from './delete-destination-port'
import { listDestinationPortsByDestinationRoute } from './list-destination-ports-by-destination'

// Export all destination port routes
export const destinationPortRoutes = [
	getDestinationPortRoute,
	createDestinationPortRoute,
	putDestinationPortRoute,
	patchDestinationPortRoute,
	deleteDestinationPortRoute,
	listDestinationPortsByDestinationRoute,
]
