// Export all routes
import { eventRoutes } from './events'
import { sourceRoutes } from './sources'
import { destinationRoutes } from './destinations'
import { partylineRoutes } from './partylines'
import { sourcePortRoutes } from './source-ports'
import { destinationPortRoutes } from './destination-ports'
import { flowEdgesRoutes } from './flow-edges'

export const routes = [
	...eventRoutes,
	...sourceRoutes,
	...destinationRoutes,
	...partylineRoutes,
	...sourcePortRoutes,
	...destinationPortRoutes,
	...Object.values(flowEdgesRoutes),
]
