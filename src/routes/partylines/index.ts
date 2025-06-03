import { getPartylineRoute } from './get-partyline'
import { createPartylineRoute } from './create-partyline'
import { putPartylineRoute, patchPartylineRoute } from './update-partyline'
import { deletePartylineRoute } from './delete-partyline'

// Export all partyline routes
export const partylineRoutes = [
	getPartylineRoute,
	createPartylineRoute,
	putPartylineRoute,
	patchPartylineRoute,
	deletePartylineRoute,
]
