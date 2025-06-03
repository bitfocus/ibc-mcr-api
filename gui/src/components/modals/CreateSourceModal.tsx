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

interface CreateSourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onSuccess: () => void
}

export const CreateSourceModal = ({ open, onOpenChange, eventId, onSuccess }: CreateSourceModalProps) => {
  const [label, setLabel] = useState('')
  
  const createSource = api.useMutation('post', '/sources')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSource.mutateAsync({
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
          <DialogTitle>Create Source</DialogTitle>
          <DialogDescription>
            Add a new input source to the event
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Source Label (e.g. Main Camera)"
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
