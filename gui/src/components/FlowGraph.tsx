import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { api } from '../api'
import { 
  ReactFlow,
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Position
} from '@xyflow/react'
import type { Connection, Edge, Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Define types for our data
interface Port {
  id: string
  type: string
  channel: number
  description?: string
}

interface Source {
  id: string
  label: string
  ports?: Port[]
}

interface Destination {
  id: string
  label: string
  ports?: Port[]
}

interface FlowEdge {
  id: string
  sourcePortId: string
  destinationPortId: string
}

interface FlowGraphProps {
  eventId: string
  sources: Source[]
  destinations: Destination[]
  flowEdges?: FlowEdge[]
  onCreateEdge?: (sourcePortId: string, destinationPortId: string) => void
}

export const FlowGraph = ({ eventId, sources, destinations, flowEdges = [], onCreateEdge }: FlowGraphProps) => {
  // Create nodes for sources and destinations
  const initialNodes: Node[] = useMemo(() => {
    const sourceNodes: Node[] = sources.flatMap((source, sourceIndex) => {
      // Create a node for the source
      const sourceNode: Node = {
        id: `${source.id}`,
        type: 'input',
        data: { label: source.label },
        position: { x: 0, y: sourceIndex * 200 },
        style: { 
          background: '#d4e6f1', 
          border: '1px solid #3498db', 
          width: 250,
          padding: '10px',
          borderRadius: '8px'
        }
      }
      
      // Create nodes for each port
      const portNodes: Node[] = (source.ports || []).map((port, portIndex) => ({
        id: `port-${port.id}`,
        data: { 
          label: `${port.type} ${port.channel}${port.description ? `: ${port.description}` : ''}` 
        },
        position: { x: 20, y: 60 + portIndex * 40 },
        parentNode: `${source.id}`,
        extent: 'parent',
        style: { 
          background: port.type === 'video' ? '#d5f5e3' : '#fadbd8', 
          width: 200,
          padding: '8px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '2px solid #34495e',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        // Source ports should only have outgoing connections (right side)
        sourcePosition: Position.Right,
        targetPosition: undefined // No incoming connections for source ports
      }))
      
      return [sourceNode, ...portNodes]
    })
    
    const destinationNodes: Node[] = destinations.flatMap((destination, destIndex) => {
      // Create a node for the destination
      const destNode: Node = {
        id: `${destination.id}`,
        type: 'output',
        data: { label: destination.label },
        position: { x: 600, y: destIndex * 200 },
        style: { 
          background: '#e8daef', 
          border: '1px solid #8e44ad', 
          width: 250,
          padding: '10px',
          borderRadius: '8px'
        }
      }
      
      // Create nodes for each port
      const portNodes: Node[] = (destination.ports || []).map((port, portIndex) => ({
        id: `port-${port.id}`,
        data: { 
          label: `${port.type} ${port.channel}${port.description ? `: ${port.description}` : ''}` 
        },
        position: { x: 30, y: 60 + portIndex * 40 },
        parentNode: `${destination.id}`,
        extent: 'parent',
        style: { 
          background: port.type === 'video' ? '#d5f5e3' : '#fadbd8', 
          width: 200,
          padding: '8px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '2px solid #34495e',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        // Destination ports should only have incoming connections (left side)
        sourcePosition: undefined, // No outgoing connections for destination ports
        targetPosition: Position.Left
      }))
      
      return [destNode, ...portNodes]
    })
    
    return [...sourceNodes, ...destinationNodes]
  }, [sources, destinations])
  
  // Create edges from flowEdges
  const initialEdges: Edge[] = useMemo(() => {
    return flowEdges.map(edge => ({
      id: `edge-${edge.id}`,
      source: `port-${edge.sourcePortId}`,
      target: `port-${edge.destinationPortId}`,
      animated: true,
      style: { 
        stroke: '#2ecc71',
        strokeWidth: 3
      }
    }))
  }, [flowEdges])
  
  // Update nodes when sources or destinations change
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Update nodes and edges when sources, destinations, or flowEdges change
  useEffect(() => {
    setNodes(initialNodes);
  }, [sources, destinations, setNodes, initialNodes]);
  
  useEffect(() => {
    setEdges(initialEdges);
  }, [flowEdges, setEdges, initialEdges]);
  
  const createFlowEdge = api.useMutation('post', '/flow-edges')
  const deleteFlowEdge = api.useMutation('delete', '/flow-edges/{flowEdgeId}')
  
  // Track the selected edge for deletion
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)
  
  // Handle edge click for deletion
  const onEdgeClick = useCallback(
    async (_: MouseEvent, edge: Edge) => {
      // Extract the flow edge ID from the edge ID
      const flowEdgeId = edge.id.replace('edge-', '')
      
      try {
        // Call the API to delete the flow edge
        await deleteFlowEdge.mutateAsync({
          params: {
            path: {
              flowEdgeId
            }
          }
        })
        
        // Remove the edge from the graph
        setEdges(edges => edges.filter(e => e.id !== edge.id))
        
        // Refresh the flow edges
        if (onCreateEdge) {
          // Use onCreateEdge as a trigger to refresh the flow edges
          onCreateEdge('', '')
        }
      } catch (error) {
        console.error('Failed to delete flow edge:', error)
      }
    },
    [deleteFlowEdge, setEdges, onCreateEdge]
  )
  
  const onConnect = useCallback(
    async (connection: Connection) => {
      // Extract the port IDs from the node IDs
      const sourceId = connection.source?.replace('port-', '')
      const targetId = connection.target?.replace('port-', '')
      
      if (sourceId && targetId) {
        try {
          // Call the API to create the flow edge
          await createFlowEdge.mutateAsync({
            body: {
              sourcePortId: sourceId,
              destinationPortId: targetId,
            },
          })
          
          // Also call the local handler if provided
          if (onCreateEdge) {
            onCreateEdge(sourceId, targetId)
          }
          
          // Add the edge to the graph
          setEdges((eds) => addEdge(connection, eds))
        } catch (error) {
          console.error('Failed to create flow edge:', error)
        }
      }
    },
    [setEdges, onCreateEdge, createFlowEdge]
  )
  
  return (
    <div>
      <div className="mb-2 text-sm text-gray-500 italic">
        Tip: Click on a connection line to delete it. Drag from a source port to a destination port to create a new connection.
      </div>
      <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        connectionLineStyle={{ stroke: '#2ecc71', strokeWidth: 3 }}
        defaultEdgeOptions={{
          style: { stroke: '#2ecc71', strokeWidth: 3 },
          animated: true
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      </div>
    </div>
  )
}
