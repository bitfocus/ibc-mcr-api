import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Events } from './components/Events'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
})

const persister = createSyncStoragePersister({
	storage: window.localStorage,
})

function App() {
	return (
		<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
			<Events />
			<ReactQueryDevtools initialIsOpen />
		</PersistQueryClientProvider>
	)
}

export default App
