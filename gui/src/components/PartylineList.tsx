// Component for displaying a list of partylines
import { api } from '../api'
import type { Partyline } from '@/types'
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'

interface PartylineListProps {
  partylines: Partyline[]
  onRefresh: () => void
}

export const PartylineList = ({ partylines, onRefresh }: PartylineListProps) => {
  const deletePartyline = api.useMutation('delete', '/partylines/{partylineId}')

  if (!partylines || partylines.length === 0) {
    return <p className="text-sm text-gray-500">No partylines added yet</p>
  }

  return (
    <div className="space-y-2">
      {partylines.map((partyline: Partyline) => (
        <div key={partyline.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
          <h4 className="font-medium">{partyline.title}</h4>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              try {
                await deletePartyline.mutateAsync({
                  params: {
                    path: {
                      partylineId: partyline.id,
                    },
                  },
                })
                onRefresh()
              } catch (error) {
                console.error('Failed to delete partyline:', error)
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
