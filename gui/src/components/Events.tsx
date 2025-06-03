import { useState } from 'react'
import { api } from '../api'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DataTable } from './table'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { EventEdit } from './EventEdit'

export const Events = () => {
	const {
		data: eventsData,
		error: eventsError,
		isLoading: eventsLoading,
		refetch: refetchEvents,
	} = api.useQuery('get', '/events', { params: {} })
	const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false)
	const [createEventTitle, setCreateEventTitle] = useState('')
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

	const deleteEvent = api.useMutation('delete', '/events/{eventId}')
	const createEvent = api.useMutation('post', '/events')

	const columns: ColumnDef<{
		id: string
		title: string
		createdAt: string
		updatedAt: string
	}>[] = [
		{
			accessorKey: 'view',
			header: 'Edit',
			cell: ({ row }) => {
				return (
					<Button
						variant={selectedEventId === row.original.id ? 'default' : 'outline'}
						onClick={() => {
							if (row.original.id === selectedEventId) {
								setSelectedEventId(null)
							} else {
								setSelectedEventId(row.original.id)
							}
						}}
					>
						View
					</Button>
				)
			},
		},
		{
			accessorKey: 'title',
			header: 'Title',
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
		},
		{
			accessorKey: 'updatedAt',
			header: 'Updated At',
		},
		// delete button
		{
			accessorKey: 'delete',
			header: 'Delete',
			cell: ({ row }) => {
				return (
					<Button
						onClick={async () => {
							await deleteEvent.mutateAsync({
								params: {
									path: {
										eventId: row.original.id,
									},
								},
							})
							if (selectedEventId === row.original.id) {
								setSelectedEventId(null)
							}
							refetchEvents()
						}}
					>
						Delete
					</Button>
				)
			},
		},
	]

	if (eventsLoading || !eventsData) return 'Loading...'
	if (eventsError) return `An error occured: ${eventsError.message}`

	return (
		<div className="flex w-full">
			<div className={selectedEventId ? "w-1/3 pl-4" : "w-full pl-4"}>
				<Card className="mx-auto mt-4">
					<CardHeader>
						<CardTitle>Events</CardTitle>
						<CardDescription>
							An identifier for the broadcasting event/session we want to define
						</CardDescription>
						<CardAction>
							<Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
								<DialogTrigger asChild>
									<Button>Create</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create Event</DialogTitle>
										<DialogDescription>
											Create a new broadcasting event/session
										</DialogDescription>
									</DialogHeader>
									<form
										className="flex flex-col gap-2 mt-4"
										onSubmit={async (e) => {
											e.preventDefault()
											await createEvent.mutateAsync({
												body: {
													title: createEventTitle,
												},
											})
											setCreateEventTitle('')
											setCreateEventDialogOpen(false)
											refetchEvents()
										}}
									>
										<Input
											placeholder="Event 2026"
											value={createEventTitle}
											onChange={(e) => setCreateEventTitle(e.target.value)}
										/>

										<Button type="submit">Create</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												setCreateEventDialogOpen(false)
											}}
										>
											Cancel
										</Button>
									</form>
								</DialogContent>
							</Dialog>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={eventsData} />
					</CardContent>
					<CardFooter className="text-neutral-300">
						{/* number of events */}
						<p>
							{eventsData.length} event{eventsData.length === 1 ? '' : 's'}
						</p>
					</CardFooter>
				</Card>
			</div>
			
			{selectedEventId && (
				<div className="w-2/3">
					<EventEdit 
						eventId={selectedEventId} 
						onEventUpdated={refetchEvents} 
					/>
				</div>
			)}
		</div>
	)
}
