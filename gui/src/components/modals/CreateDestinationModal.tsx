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

interface CreateDestinationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onSuccess: () => void
}

export const CreateDestinationModal = ({ open, onOpenChange, eventId, onSuccess }: CreateDestinationModalProps) => {
  const [label, setLabel] = useState('')
  
  const createDestination = api.useMutation('post', '/destinations')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDestination.mutateAsync({
      body: {
        label,
        eventId,
      },
    })
    setLabel('')
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Destination</DialogTitle>
          <DialogDescription>
            Add a new output destination to the event
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Destination Label (e.g. Output Stream 1)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <Button type="submit">Create</Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
