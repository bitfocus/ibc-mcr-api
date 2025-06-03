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

interface CreateSourcePortModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceId: string
  onSuccess: () => void
}

export const CreateSourcePortModal = ({ open, onOpenChange, sourceId, onSuccess }: CreateSourcePortModalProps) => {
  const [type, setType] = useState('audio')
  const [channel, setChannel] = useState('1')
  const [description, setDescription] = useState('')
  
  const createSourcePort = api.useMutation('post', '/source-ports')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSourcePort.mutateAsync({
      body: {
        type,
        channel: Number.parseInt(channel, 10),
        description: description || undefined,
        sourceId,
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
          <DialogTitle>Create Source Port</DialogTitle>
          <DialogDescription>
            Add a new port to the source
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
              placeholder="Main audio feed"
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
