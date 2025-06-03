import { getSourcePortRoute } from './get-source-port'
import { createSourcePortRoute } from './create-source-port'
import { putSourcePortRoute, patchSourcePortRoute } from './update-source-port'
import { deleteSourcePortRoute } from './delete-source-port'

// Export all source port routes
export const sourcePortRoutes = [
	getSourcePortRoute,
	createSourcePortRoute,
	putSourcePortRoute,
	patchSourcePortRoute,
	deleteSourcePortRoute,
]
