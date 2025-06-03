import { useState } from 'react'
import { api } from '../../api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreateDestinationPortModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destinationId: string
  onSuccess: () => void
}

export const CreateDestinationPortModal = ({ open, onOpenChange, destinationId, onSuccess }: CreateDestinationPortModalProps) => {
  const [type, setType] = useState('audio')
  const [channel, setChannel] = useState('1')
  const [description, setDescription] = useState('')
  
  const createDestinationPort = api.useMutation('post', '/destination-ports')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDestinationPort.mutateAsync({
      body: {
        type,
        channel: Number.parseInt(channel, 10),
        description: description || undefined,
        destinationId,
      },
    })
    
    // Reset form
    setType('audio')
    setChannel('1')
    setDescription('')
    
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Destination Port</DialogTitle>
          <DialogDescription>
            Add a new port to the destination
          </DialogDescription>
        </DialogHeader>
        
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="type">Port Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="channel">Channel Number</Label>
            <Input
              id="channel"
              type="number"
              min="1"
              placeholder="1"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Main audio output"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button type="submit">Create</Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
