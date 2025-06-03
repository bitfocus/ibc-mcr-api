import { useState } from 'react'
import { api } from '../../api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Port {
  id: string
  type: string
  channel: number
  description?: string
}

interface Source {
  id: string
  label: string
  ports?: Port[]
}

interface Destination {
  id: string
  label: string
  ports?: Port[]
}

interface CreateFlowEdgeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sources: Source[]
  destinations: Destination[]
  onSuccess?: () => void
  onCreateEdge?: (sourcePortId: string, destinationPortId: string) => void
}

export const CreateFlowEdgeModal = ({ 
  open, 
  onOpenChange, 
  sources, 
  destinations, 
  onSuccess,
  onCreateEdge
}: CreateFlowEdgeModalProps) => {
  const [sourceId, setSourceId] = useState<string>('')
  const [sourcePortId, setSourcePortId] = useState<string>('')
  const [destinationId, setDestinationId] = useState<string>('')
  const [destinationPortId, setDestinationPortId] = useState<string>('')
  
  // Get the selected source and destination
  const selectedSource = sources.find(s => s.id === sourceId)
  const selectedDestination = destinations.find(d => d.id === destinationId)
  
  // Reset port selections when source/destination changes
  const handleSourceChange = (value: string) => {
    setSourceId(value)
    setSourcePortId('')
  }
  
  const handleDestinationChange = (value: string) => {
    setDestinationId(value)
    setDestinationPortId('')
  }
  
  const createFlowEdge = api.useMutation('post', '/flow-edges')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sourcePortId || !destinationPortId) {
      return
    }
    
    try {
      // Call the API to create the flow edge
      await createFlowEdge.mutateAsync({
        body: {
          sourcePortId,
          destinationPortId,
        },
      })
      
      // Also call the local handler if provided
      if (onCreateEdge) {
        onCreateEdge(sourcePortId, destinationPortId)
      }
      
      // Reset form
      setSourceId('')
      setSourcePortId('')
      setDestinationId('')
      setDestinationPortId('')
      
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create flow edge:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
          <DialogDescription>
            Connect a source port to a destination port
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={sourceId} onValueChange={handleSourceChange}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedSource?.ports && selectedSource.ports.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="sourcePort">Source Port</Label>
              <Select value={sourcePortId} onValueChange={setSourcePortId}>
                <SelectTrigger id="sourcePort">
                  <SelectValue placeholder="Select a source port" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSource.ports.map(port => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.type} {port.channel}{port.description ? `: ${port.description}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Select value={destinationId} onValueChange={handleDestinationChange}>
              <SelectTrigger id="destination">
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map(destination => (
                  <SelectItem key={destination.id} value={destination.id}>
                    {destination.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDestination?.ports && selectedDestination.ports.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="destinationPort">Destination Port</Label>
              <Select value={destinationPortId} onValueChange={setDestinationPortId}>
                <SelectTrigger id="destinationPort">
                  <SelectValue placeholder="Select a destination port" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDestination.ports.map(port => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.type} {port.channel}{port.description ? `: ${port.description}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!sourcePortId || !destinationPortId}
            >
              Create Connection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
