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

interface CreatePartylineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onSuccess: () => void
}

export const CreatePartylineModal = ({ open, onOpenChange, eventId, onSuccess }: CreatePartylineModalProps) => {
  const [title, setTitle] = useState('')
  
  const createPartyline = api.useMutation('post', '/partylines')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPartyline.mutateAsync({
      body: {
        title,
        eventId,
      },
    })
    setTitle('')
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Partyline</DialogTitle>
          <DialogDescription>
            Add a new communication partyline to the event
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Partyline Title (e.g. Main Communication Channel)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
