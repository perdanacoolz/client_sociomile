import api from '@/lib/axios';
import { ApiFilter, PagedResponse } from '@/types/common';
import { Role, RoleRequest } from '../types';

const ENDPOINT = '/Role';

export const roleService = {
    getAll: async (params?: ApiFilter) => {
        const response = await api.get<PagedResponse<Role>>(ENDPOINT, { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Role>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (data: RoleRequest) => {
        const response = await api.post<Role>(ENDPOINT, data);
        return response.data;
    },

    update: async (id: string, data: RoleRequest) => {
        const response = await api.put<Role>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<void>(`${ENDPOINT}/${id}`);
        return response.data;
    }
};
