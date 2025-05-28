import { getSourceRoute } from "./get-source";
import { createSourceRoute } from "./create-source";
import { putSourceRoute, patchSourceRoute } from "./update-source";
import { deleteSourceRoute } from "./delete-source";
// Removed list-sources route as we'll access sources through events

// Export all source routes
export const sourceRoutes = [
  getSourceRoute,
  createSourceRoute,
  putSourceRoute,
  patchSourceRoute,
  deleteSourceRoute,
  // listSourcesRoute removed
];
