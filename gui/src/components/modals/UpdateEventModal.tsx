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
import type { paths } from '@/api-schema'

interface UpdateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: paths['/events/{eventId}']['get']['responses']['200']['content']['application/json']
  onSuccess?: () => void
}

export const UpdateEventModal = ({ open, onOpenChange, event, onSuccess }: UpdateEventModalProps) => {
  const [title, setTitle] = useState(event.title)
  const updateEvent = api.useMutation('patch', '/events/{eventId}')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateEvent.mutateAsync({
        params: {
          path: {
            eventId: event.id,
          },
        },
        body: {
          title,
        },
      })
      
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription>
            Update the event details
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Button type="submit">Update</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
