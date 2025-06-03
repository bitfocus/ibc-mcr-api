// Component for displaying a list of ports for a destination
import { api } from '../api'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface DestinationPortListProps {
	destinationId: string
	onRefresh: () => void
	onRefreshFlowEdges: () => void
}

export const DestinationPortList = ({ destinationId, onRefresh, onRefreshFlowEdges }: DestinationPortListProps) => {
	const deleteDestinationPort = api.useMutation('delete', '/destination-ports/{destinationPortId}')

	const destinationPorts = api.useQuery('get', '/destination-ports/by-destination/{destinationId}', {
		params: {
			path: {
				destinationId,
			},
		},
	})

	if (!destinationPorts.data || destinationPorts.data.length === 0) {
		return <p className="text-sm text-gray-500 mt-2">No ports added yet</p>
	}

	return (
		<div className="pl-4 border-l-2 border-gray-200 space-y-2 mt-2">
			{destinationPorts.data?.map((port) => (
				<div key={port.id} className="flex justify-between items-center">
					<span className="text-sm">
						{port.type} {port.channel}
						{port.description ? `: ${port.description}` : ''}
					</span>
					<Button
						size="sm"
						variant="outline"
						onClick={async () => {
							try {
								await deleteDestinationPort.mutateAsync({
									params: {
										path: {
											destinationPortId: port.id,
										},
									},
								})
								onRefresh()
								onRefreshFlowEdges()
							} catch (error) {
								console.error('Failed to delete destination port:', error)
							}
						}}
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			))}
		</div>
	)
}
