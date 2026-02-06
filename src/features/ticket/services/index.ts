import api from "@/lib/axios";
import type { Ticket, TicketListResponse, TicketRequest } from "../types";

const ENDPOINT = "/Ticket";

interface GetAllParams {
    Filters?: string;
    Sorts?: string;
    Page?: number;
    PageSize?: number;
}

export const ticketService = {
    async getAll(params?: GetAllParams): Promise<TicketListResponse> {
        try {
            const response = await api.get<TicketListResponse>(ENDPOINT, {
                params,
            });
            return response.data;
        } catch (error: any) {
            console.error(`[ticketservice] Error fetching machines from ${ENDPOINT}:`, error.response?.data || error.message);
 
            return {
                items: [],
                totalCount: 0,
                page: params?.Page || 1,
                pageSize: params?.PageSize || 10,
            };
        }
    },

    async getById(id: string): Promise<Ticket> {
        const response = await api.get<Ticket>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    async create(data: TicketRequest): Promise<Ticket> {
        const response = await api.post<Ticket>(ENDPOINT, data);
        return response.data;
    },

    async update(id: string, data: TicketRequest): Promise<Ticket> {
        const response = await api.put<Ticket>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

