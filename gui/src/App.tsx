import * as React from 'react'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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

type Event = {
  id: number
  title: string
  body: string
}

function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Array<Event>> => {
      const response = await fetch('/api/v1/events')
      return await response.json()
    },
  })
}

function Events({
  setEventId,
}: {
  setEventId: React.Dispatch<React.SetStateAction<number>>
}) {
  const queryClient = useQueryClient()
  const { status, data, error, isFetching } = useEvents()

  return (
    <div>
      <h1>Events</h1>
      <div>
        {status === 'pending' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((event) => (
                <p key={event.id}>
                  <a
                    onClick={() => setEventId(event.id)}
                    href="#"
                    style={
                      // We can access the query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(['event', event.id])
                        ? {
                          fontWeight: 'bold',
                          color: 'green',
                        }
                        : {}
                    }
                  >
                    {event.title}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  )
}

const getEventById = async (id: number): Promise<Event> => {
  const response = await fetch(
    `/api/v1/events${id}`,
  )
  return await response.json()
}

function useEvent(eventId: number) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  })
}

function Event({
  eventId,
  setEventId,
}: {
  eventId: number
  setEventId: React.Dispatch<React.SetStateAction<number>>
}) {
  const { status, data, error, isFetching } = useEvent(eventId)

  return (
    <div>
      <div>
        <a onClick={() => setEventId(-1)} href="#">
          Back
        </a>
      </div>
      {!eventId || status === 'pending' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>{isFetching ? 'Background Updating...' : ' '}</div>
        </>
      )}
    </div>
  )
}

function App() {
  const [eventId, setEventId] = React.useState(-1)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {eventId > -1 ? (
        <Event eventId={eventId} setEventId={setEventId} />
      ) : (
        <Events setEventId={setEventId} />
      )}
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  )
}



export default App
