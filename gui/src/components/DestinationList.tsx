// Component for displaying a list of destinations and their ports
import { api } from '../api'
import { Button } from './ui/button'
import type { DestinationWithPorts } from '@/types'
import { Trash2 } from 'lucide-react'
import { DestinationPortList } from './DestinationPortList'

interface DestinationListProps {
  destinations: DestinationWithPorts[]
  onAddPort: (destinationId: string) => void
  onRefresh: () => void
  onRefreshFlowEdges: () => void
}

export const DestinationList = ({ destinations, onAddPort, onRefresh, onRefreshFlowEdges }: DestinationListProps) => {
  const deleteDestination = api.useMutation('delete', '/destinations/{destinationId}')

  if (!destinations || destinations.length === 0) {
    return <p className="text-sm text-gray-500">No destinations added yet</p>
  }

  return (
    <div className="space-y-4">
      {destinations.map((destination: DestinationWithPorts) => (
        <div key={destination.id} className="p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{destination.label}</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onAddPort(destination.id)}
              >
                Add Port
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  try {
                    await deleteDestination.mutateAsync({
                      params: {
                        path: {
                          destinationId: destination.id,
                        },
                      },
                    })
                    onRefresh()
                  } catch (error) {
                    console.error(
                      'Failed to delete destination:',
                      error,
                    )
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Destination Ports */}
          <DestinationPortList 
            destinationId={destination.id}
            onRefresh={onRefresh}
            onRefreshFlowEdges={onRefreshFlowEdges}
          />
        </div>
      ))}
    </div>
  )
}
