// Export all routes
import { eventRoutes } from './events';
import { sourceRoutes } from './sources';
import { destinationRoutes } from './destinations';

export const routes = [
  ...eventRoutes,
  ...sourceRoutes,
  ...destinationRoutes,
];
