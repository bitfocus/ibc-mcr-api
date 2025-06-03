import { useState } from 'react'
import { api, apiclient } from '../api'
import { Button } from './ui/button'
import type { SourceWithPorts, DestinationWithPorts } from '@/types'
// Component for editing an event
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { UpdateEventModal } from './modals/UpdateEventModal'
import { CreateSourceModal } from './modals/CreateSourceModal'
import { CreateDestinationModal } from './modals/CreateDestinationModal'
import { CreatePartylineModal } from './modals/CreatePartylineModal'
import { CreateSourcePortModal } from './modals/CreateSourcePortModal'
import { CreateDestinationPortModal } from './modals/CreateDestinationPortModal'
import { FlowGraph } from './FlowGraph'
import { SourceList } from './SourceList'
import { DestinationList } from './DestinationList'
import { PartylineList } from './PartylineList'

interface EventEditProps {
  eventId: string
  onEventUpdated: () => void
}

export const EventEdit = ({ eventId, onEventUpdated }: EventEditProps) => {
  const [updateEventDialogOpen, setUpdateEventDialogOpen] = useState(false)
  const [createSourceDialogOpen, setCreateSourceDialogOpen] = useState(false)
  const [createDestinationDialogOpen, setCreateDestinationDialogOpen] = useState(false)
  const [createPartylineDialogOpen, setCreatePartylineDialogOpen] = useState(false)
  const [createSourcePortDialogOpen, setCreateSourcePortDialogOpen] = useState(false)
  const [createDestinationPortDialogOpen, setCreateDestinationPortDialogOpen] = useState(false)

  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null)
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])

  // Fetch flow edges for the selected event
  const { data: flowEdgesData = [], refetch: refetchFlowEdges } = api.useQuery('get', '/flow-edges', {
    enabled: !!eventId,
  })

  // Fetch selected event details
  const { data: eventData, refetch: refetchEventData } = api.useQuery('get', '/events/{eventId}', {
    params: {
      path: {
        eventId,
      },
    },
    enabled: !!eventId,
  })

  // Fetch source ports for a specific source
  const fetchSourcePorts = async (sourceId: string) => {
    try {
      // Use the new endpoint to fetch source ports directly
      const { data } = await (apiclient.GET as any)('/source-ports/by-source/{sourceId}', {
        params: {
          path: {
            sourceId
          }
        }
      })
      
      if (data) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching source ports:', error)
      return []
    }
  }
  
  // Fetch destination ports for a specific destination
  const fetchDestinationPorts = async (destinationId: string) => {
    try {
      // Use the new endpoint to fetch destination ports directly
      const { data } = await (apiclient.GET as any)('/destination-ports/by-destination/{destinationId}', {
        params: {
          path: {
            destinationId
          }
        }
      })
      
      if (data) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching destination ports:', error)
      return []
    }
  }

  const handleCreateEdge = async (sourcePortId: string, destinationPortId: string) => {
    if (!eventId) return

    try {
      // The API call is now handled in the CreateFlowEdgeModal component
      // This function is called after the API call succeeds
      console.log('Edge created between:', sourcePortId, 'and', destinationPortId)
      refetchFlowEdges()
    } catch (error) {
      console.error('Failed to create flow edge:', error)
    }
  }

  if (!eventData) return <div>Loading event data...</div>

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{eventData.title}</h2>
            <p className="text-gray-500 text-sm">{eventId}</p>
          </div>
          <Button onClick={() => setUpdateEventDialogOpen(true)}>Edit</Button>
        </div>

        <div className="space-y-6">
          <Accordion
            type="multiple"
            className="w-full"
            value={openAccordionItems}
            onValueChange={setOpenAccordionItems}
          >
            {/* Sources Accordion */}
            <AccordionItem value="sources" className="border rounded-md px-4">
              <AccordionTrigger className="flex justify-between py-3">
                <div className="text-left font-medium">Sources</div>
                <div onClick={(e) => e.stopPropagation()} className="mr-4">
                  <Button
                    onClick={() => setCreateSourceDialogOpen(true)}
                    size="sm"
                    variant="outline"
                  >
                    Create Source
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <SourceList 
                  sources={eventData.sources || []}
                  onAddPort={(sourceId) => {
                    setSelectedSourceId(sourceId)
                    setCreateSourcePortDialogOpen(true)
                  }}
                  onRefresh={refetchEventData}
                  onRefreshFlowEdges={refetchFlowEdges}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Destinations Accordion */}
            <AccordionItem value="destinations" className="border rounded-md px-4">
              <AccordionTrigger className="flex justify-between py-3">
                <div className="text-left font-medium">Destinations</div>
                <div onClick={(e) => e.stopPropagation()} className="mr-4">
                  <Button
                    onClick={() => setCreateDestinationDialogOpen(true)}
                    size="sm"
                    variant="outline"
                  >
                    Create Destination
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <DestinationList 
                  destinations={eventData.destinations || []}
                  onAddPort={(destinationId) => {
                    setSelectedDestinationId(destinationId)
                    setCreateDestinationPortDialogOpen(true)
                  }}
                  onRefresh={refetchEventData}
                  onRefreshFlowEdges={refetchFlowEdges}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Partylines Accordion */}
            <AccordionItem value="partylines" className="border rounded-md px-4">
              <AccordionTrigger className="flex justify-between py-3">
                <div className="text-left font-medium">Partylines</div>
                <div onClick={(e) => e.stopPropagation()} className="mr-4">
                  <Button
                    onClick={() => setCreatePartylineDialogOpen(true)}
                    size="sm"
                    variant="outline"
                  >
                    Create Partyline
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <PartylineList 
                  partylines={eventData.partylines || []}
                  onRefresh={refetchEventData}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Flow Graph - Always visible */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Flow Graph</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect source ports to destination ports by dragging from a source port to a
              destination port
            </p>
            <FlowGraph
              eventId={eventId}
              sources={(eventData.sources as SourceWithPorts[]) || []}
              destinations={(eventData.destinations as DestinationWithPorts[]) || []}
              flowEdges={flowEdgesData}
              onCreateEdge={handleCreateEdge}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateEventModal
        open={updateEventDialogOpen}
        onOpenChange={setUpdateEventDialogOpen}
        event={eventData}
        onSuccess={() => {
          onEventUpdated()
          refetchEventData()
        }}
      />

      <CreateSourceModal
        open={createSourceDialogOpen}
        onOpenChange={setCreateSourceDialogOpen}
        eventId={eventId}
        onSuccess={() => {
          refetchEventData()
          // Open the sources accordion when a new source is created
          if (!openAccordionItems.includes('sources')) {
            setOpenAccordionItems([...openAccordionItems, 'sources'])
          }
        }}
      />

      <CreateDestinationModal
        open={createDestinationDialogOpen}
        onOpenChange={setCreateDestinationDialogOpen}
        eventId={eventId}
        onSuccess={() => {
          refetchEventData()
          // Open the destinations accordion when a new destination is created
          if (!openAccordionItems.includes('destinations')) {
            setOpenAccordionItems([...openAccordionItems, 'destinations'])
          }
        }}
      />

      <CreatePartylineModal
        open={createPartylineDialogOpen}
        onOpenChange={setCreatePartylineDialogOpen}
        eventId={eventId}
        onSuccess={() => {
          refetchEventData()
          // Open the partylines accordion when a new partyline is created
          if (!openAccordionItems.includes('partylines')) {
            setOpenAccordionItems([...openAccordionItems, 'partylines'])
          }
        }}
      />

      {selectedSourceId && (
        <CreateSourcePortModal
          open={createSourcePortDialogOpen}
          onOpenChange={setCreateSourcePortDialogOpen}
          sourceId={selectedSourceId}
          onSuccess={async () => {
            // Fetch the updated source ports for this source
            const updatedPorts = await fetchSourcePorts(selectedSourceId)

            // Update the eventData with the new ports
            if (eventData?.sources) {
              const updatedSources = eventData.sources.map((source) => {
                if (source.id === selectedSourceId) {
                  return {
                    ...source,
                    ports: updatedPorts,
                  }
                }
                return source
              })

              // Update the eventData
              eventData.sources = updatedSources
            }

            refetchEventData()
            refetchFlowEdges() // Refresh flow edges to update the map
          }}
        />
      )}

      {selectedDestinationId && (
        <CreateDestinationPortModal
          open={createDestinationPortDialogOpen}
          onOpenChange={setCreateDestinationPortDialogOpen}
          destinationId={selectedDestinationId}
          onSuccess={async () => {
            // Fetch the updated destination ports for this destination
            const updatedPorts = await fetchDestinationPorts(selectedDestinationId)

            // Update the eventData with the new ports
            if (eventData?.destinations) {
              const updatedDestinations = eventData.destinations.map((destination) => {
                if (destination.id === selectedDestinationId) {
                  return {
                    ...destination,
                    ports: updatedPorts,
                  }
                }
                return destination
              })

              // Update the eventData
              eventData.destinations = updatedDestinations
            }

            refetchEventData()
            refetchFlowEdges() // Refresh flow edges to update the map
          }}
        />
      )}
    </div>
  )
}
