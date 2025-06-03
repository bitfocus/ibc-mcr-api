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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

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
	const [createDefaultPorts, setCreateDefaultPorts] = useState(true)
	const [createDefaultConnections, setCreateDefaultConnections] = useState(true)

	const deleteEvent = api.useMutation('delete', '/events/{eventId}')
	const createEvent = api.useMutation('post', '/events')
	const createSource = api.useMutation('post', '/sources')
	const createDestination = api.useMutation('post', '/destinations')
	const createSourcePort = api.useMutation('post', '/source-ports')
	const createDestinationPort = api.useMutation('post', '/destination-ports')
	const createFlowEdge = api.useMutation('post', '/flow-edges')

	// Function to create default ports and connections for an event
	const createDefaultPortsAndConnections = async (eventId: string) => {
		if (!eventId) {
			console.error('Cannot create ports: No event ID provided')
			return
		}

		try {
			console.log('Creating default ports and connections for event:', eventId)

			// Debug: Log the current state
			console.log('Current state:', { createDefaultPorts, createDefaultConnections })

			// Create input source "PGM RX"
			console.log('Creating input source "PGM RX"')
			const inputSource = await createSource.mutateAsync({
				body: {
					label: 'PGM RX',
					eventId,
				},
			})
			console.log('Input source created:', inputSource)

			// Create output destinations "PGM RX" and "Monitor"
			console.log('Creating output destination "PGM RX"')
			const outputPgmRx = await createDestination.mutateAsync({
				body: {
					label: 'PGM RX',
					eventId,
				},
			})
			console.log('Output PGM RX created:', outputPgmRx)

			console.log('Creating output destination "Monitor"')
			const outputMonitor = await createDestination.mutateAsync({
				body: {
					label: 'Monitor',
					eventId,
				},
			})
			console.log('Output Monitor created:', outputMonitor)

			// Create source ports (1 video, 8 audio)
			const sourceVideoPorts = []
			const sourceAudioPorts = []

			// Create 1 video port for input
			const sourceVideoPort = await createSourcePort.mutateAsync({
				body: {
					type: 'video',
					channel: 1,
					description: 'Video Input',
					sourceId: inputSource.id,
				},
			})
			sourceVideoPorts.push(sourceVideoPort)

			// Create 8 audio ports for input
			for (let i = 1; i <= 8; i++) {
				const sourceAudioPort = await createSourcePort.mutateAsync({
					body: {
						type: 'audio',
						channel: i,
						description: `Audio Input ${i}`,
						sourceId: inputSource.id,
					},
				})
				sourceAudioPorts.push(sourceAudioPort)
			}

			// Create destination ports for PGM RX (1 video, 8 audio)
			const pgmRxVideoPorts = []
			const pgmRxAudioPorts = []

			// Create 1 video port for PGM RX output
			const pgmRxVideoPort = await createDestinationPort.mutateAsync({
				body: {
					type: 'video',
					channel: 1,
					description: 'Video Output',
					destinationId: outputPgmRx.id,
				},
			})
			pgmRxVideoPorts.push(pgmRxVideoPort)

			// Create 8 audio ports for PGM RX output
			for (let i = 1; i <= 8; i++) {
				const pgmRxAudioPort = await createDestinationPort.mutateAsync({
					body: {
						type: 'audio',
						channel: i,
						description: `Audio Output ${i}`,
						destinationId: outputPgmRx.id,
					},
				})
				pgmRxAudioPorts.push(pgmRxAudioPort)
			}

			// Create destination ports for Monitor (1 video, 2 audio)
			const monitorVideoPorts = []
			const monitorAudioPorts = []

			// Create 1 video port for Monitor output
			const monitorVideoPort = await createDestinationPort.mutateAsync({
				body: {
					type: 'video',
					channel: 1,
					description: 'Monitor Video',
					destinationId: outputMonitor.id,
				},
			})
			monitorVideoPorts.push(monitorVideoPort)

			// Create 2 audio ports for Monitor output
			for (let i = 1; i <= 2; i++) {
				const monitorAudioPort = await createDestinationPort.mutateAsync({
					body: {
						type: 'audio',
						channel: i,
						description: `Monitor Audio ${i}`,
						destinationId: outputMonitor.id,
					},
				})
				monitorAudioPorts.push(monitorAudioPort)
			}

			// Create connections if enabled
			if (createDefaultConnections) {
				console.log('Creating default connections')

				// Connect video ports
				// Source video to PGM RX video
				await createFlowEdge.mutateAsync({
					body: {
						sourcePortId: sourceVideoPorts[0].id,
						destinationPortId: pgmRxVideoPorts[0].id,
					},
				})

				// Source video to Monitor video
				await createFlowEdge.mutateAsync({
					body: {
						sourcePortId: sourceVideoPorts[0].id,
						destinationPortId: monitorVideoPorts[0].id,
					},
				})

				// Connect audio ports
				// Source audio to PGM RX audio (all 8 channels)
				for (let i = 0; i < 8; i++) {
					await createFlowEdge.mutateAsync({
						body: {
							sourcePortId: sourceAudioPorts[i].id,
							destinationPortId: pgmRxAudioPorts[i].id,
						},
					})
				}

				// Source audio to Monitor audio (first 2 channels only)
				for (let i = 0; i < 2; i++) {
					await createFlowEdge.mutateAsync({
						body: {
							sourcePortId: sourceAudioPorts[i].id,
							destinationPortId: monitorAudioPorts[i].id,
						},
					})
				}
			}

			console.log('Default ports and connections created successfully')
		} catch (error) {
			console.error('Error creating default ports and connections:', error)
		}
	}

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
			<div className={selectedEventId ? 'w-1/3 pl-4' : 'w-full pl-4'}>
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
										<DialogDescription>Create a new broadcasting event/session</DialogDescription>
									</DialogHeader>
									<form
										className="flex flex-col gap-2 mt-4"
										onSubmit={async (e) => {
											e.preventDefault()

											try {
												// Create the event
												const eventResponse = await createEvent.mutateAsync({
													body: {
														title: createEventTitle,
													},
												})

												console.log('Event created:', eventResponse)

												// If we should create default ports and the event was created successfully
												if (createDefaultPorts && eventResponse) {
													console.log(
														'Creating default ports for event ID:',
														eventResponse.id,
													)
													await createDefaultPortsAndConnections(eventResponse.id)
												} else {
													console.log('Skipping default ports creation:', {
														createDefaultPorts,
														eventResponse,
													})
												}

												// Reset form state and close dialog
												setCreateEventTitle('')
												setCreateDefaultPorts(true)
												setCreateDefaultConnections(true)
												setCreateEventDialogOpen(false)

												// Refresh the events list
												await refetchEvents()
											} catch (error) {
												console.error('Error creating event:', error)
												// Even if there's an error, try to close the dialog and refresh
												setCreateEventDialogOpen(false)
												refetchEvents()
											}
										}}
									>
										<Input
											placeholder="Event 2026"
											value={createEventTitle}
											onChange={(e) => setCreateEventTitle(e.target.value)}
										/>

										<div className="flex items-center space-x-2 mt-2">
											<Checkbox
												id="createDefaultPorts"
												checked={createDefaultPorts}
												onCheckedChange={(checked) => {
													setCreateDefaultPorts(checked === true)
													// If ports are disabled, connections should also be disabled
													if (checked === false) {
														setCreateDefaultConnections(false)
													}
												}}
											/>
											<Label htmlFor="createDefaultPorts">
												Create default ports (1 input "PGM RX", 2 outputs "PGM RX" and
												"Monitor")
											</Label>
										</div>

										<div className="flex items-center space-x-2 mt-1">
											<Checkbox
												id="createDefaultConnections"
												checked={createDefaultConnections}
												disabled={!createDefaultPorts}
												onCheckedChange={(checked) =>
													setCreateDefaultConnections(checked === true)
												}
											/>
											<Label
												htmlFor="createDefaultConnections"
												className={!createDefaultPorts ? 'text-gray-400' : ''}
											>
												Create default connections between ports
											</Label>
										</div>

										<Button type="submit" className="mt-2">
											Create
										</Button>
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
					<EventEdit eventId={selectedEventId} onEventUpdated={refetchEvents} />
				</div>
			)}
		</div>
	)
}
