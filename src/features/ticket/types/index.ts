export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedAgentID: string;
    customerID?: string;
    tenantID?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TicketRequest {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedAgentID: string;
    customerID?: string;
    tenantID?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TicketListResponse {
    items: Ticket[];
    totalCount: number;
    page: number;
    pageSize: number;
}
