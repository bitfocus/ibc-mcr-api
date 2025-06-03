// Type definitions for the application

export interface Source {
  id: string;
  label: string;
}

// Source Port type
export interface SourcePort {
  id: string;
  type: string;
  channel: number;
  description?: string;
}

// Destination Port type
export interface DestinationPort {
  id: string;
  type: string;
  channel: number;
  description?: string;
}

// Source with ports
export interface SourceWithPorts {
  id: string;
  label: string;
  ports?: SourcePort[];
}

// Destination with ports
export interface DestinationWithPorts {
  id: string;
  label: string;
  ports?: DestinationPort[];
}

// Partyline type
export interface Partyline {
  id: string;
  title: string;
}

// Flow Edge type
export interface FlowEdge {
  id: string;
  sourcePortId: string;
  destinationPortId: string;
  createdAt: string;
  updatedAt: string;
}

// Event with all details
export interface EventWithDetails {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sources?: SourceWithPorts[];
  destinations?: DestinationWithPorts[];
  partylines?: Partyline[];
  flowEdges?: FlowEdge[];
}
