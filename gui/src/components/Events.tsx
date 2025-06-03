import { useState } from 'react'
import { api, apiclient } from '../api'
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
import type { paths } from '@/api-schema'

export const Events = () => {
	const { data, error, isLoading, refetch } = api.useQuery('get', '/events', { params: {} })
	const [open, setOpen] = useState(false)

	const deleteEvent = api.useMutation('delete', '/events/{eventId}')
	const createEvent = api.useMutation('post', '/events')

	const [createEventTitle, setCreateEventTitle] = useState('')
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
	const columns: ColumnDef<paths['/events/{eventId}']['get']['responses']['200']['content']['application/json']>[] = [
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
							refetch()
						}}
					>
						Delete
					</Button>
				)
			},
		},
	]

	if (isLoading || !data) return 'Loading...'
	if (error) return `An error occured: ${error.message}`

	const selectedEvent = data.find((event) => event.id === selectedEventId)

	return (
		<div>
			<div className="flex w-full">
				<div className="w-1/2 pl-4">
					<Card className="mx-auto mt-4">
						<CardHeader>
							<CardTitle>Events</CardTitle>
							<CardDescription>
								An identifier for the broadcasting event/session we want to define
							</CardDescription>
							<CardAction>
								<Dialog open={open} onOpenChange={setOpen}>
									<DialogTrigger>
										<Button>Create</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Create Event</DialogTitle>
											<DialogDescription>
												Create a new broadcasting event/session
												<form
													className="flex flex-col gap-2 mt-4"
													onSubmit={async () => {
														await createEvent.mutateAsync({
															body: {
																title: createEventTitle,
															},
														})
														setCreateEventTitle('')
														setOpen(false)
														refetch()
													}}
												>
													<Input
														placeholder="Event 2026"
														value={createEventTitle}
														onChange={(e) => setCreateEventTitle(e.target.value)}
													/>

													<Button>Create</Button>
													<Button
														variant="outline"
														onClick={() => {
															setOpen(false)
														}}
													>
														Cancel
													</Button>
												</form>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
							</CardAction>
						</CardHeader>
						<CardContent>
							<DataTable columns={columns} data={data} />
						</CardContent>
						<CardFooter className="text-neutral-300">
							{/* number of events */}
							<p>
								{data.length} event{data.length === 1 ? '' : 's'}
							</p>
						</CardFooter>
					</Card>
				</div>
				{selectedEventId && (
					<div className="flex flex-col gap-2 w-1/2 p-4">
						<Card className="">
							<CardHeader>
								<CardTitle>{selectedEvent?.title}</CardTitle>
								<CardDescription>{selectedEventId}</CardDescription>
							</CardHeader>
						</Card>
						<Card className="">
							<CardHeader>
								<CardTitle>Outputs</CardTitle>
								<CardDescription>Outputs are our TX feeds</CardDescription>
								<CardAction>
									<Button>Create</Button>
								</CardAction>
							</CardHeader>
						</Card>
						<Card className="">
							<CardHeader>
								<CardTitle>Inputs</CardTitle>
								<CardDescription>Outputs are our TX feeds</CardDescription>
								<CardAction>
									<Button>Create</Button>
								</CardAction>
							</CardHeader>
						</Card>
						<Card className="">
							<CardHeader>
								<CardTitle>Partylines</CardTitle>
								<CardDescription>Communication for the event</CardDescription>
								<CardAction>
									<Button>Create</Button>
								</CardAction>
							</CardHeader>
						</Card>
					</div>
				)}
			</div>
		</div>
	)
}
