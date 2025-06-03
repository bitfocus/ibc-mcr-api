// Component for displaying a list of sources and their ports
import { api } from '../api'
import { Button } from './ui/button'
import type { SourceWithPorts } from '@/types'
import { Trash2 } from 'lucide-react'
import { SourcePortList } from './SourcePortList'

interface SourceListProps {
	sources: SourceWithPorts[]
	onAddPort: (sourceId: string) => void
	onRefresh: () => void
	onRefreshFlowEdges: () => void
}

export const SourceList = ({ sources, onAddPort, onRefresh, onRefreshFlowEdges }: SourceListProps) => {
	const deleteSource = api.useMutation('delete', '/sources/{sourceId}')

	if (!sources || sources.length === 0) {
		return <p className="text-sm text-gray-500">No sources added yet</p>
	}

	return (
		<div className="space-y-4">
			{sources.map((source: SourceWithPorts) => (
				<div key={source.id} className="p-3 bg-gray-50 rounded-md">
					<div className="flex justify-between items-center mb-2">
						<h4 className="font-medium">{source.label}</h4>
						<div className="flex gap-2">
							<Button size="sm" onClick={() => onAddPort(source.id)}>
								Add Port
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={async () => {
									try {
										await deleteSource.mutateAsync({
											params: {
												path: {
													sourceId: source.id,
												},
											},
										})
										onRefresh()
										onRefreshFlowEdges()
									} catch (error) {
										console.error('Failed to delete source:', error)
									}
								}}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Source Ports */}
					<SourcePortList
						sourceId={source.id}
						onRefresh={onRefresh}
						onRefreshFlowEdges={onRefreshFlowEdges}
					/>
				</div>
			))}
		</div>
	)
}
