import api from '@/lib/axios';
import { ApiFilter, PagedResponse } from '@/types/common';
import { User, UserRequest, ChangePasswordRequest } from '../types';
import { jwtDecode } from 'jwt-decode';

const ENDPOINT = '/User';

export const userService = {
    getAll: async (params?: ApiFilter) => {
        const response = await api.get<PagedResponse<User>>(ENDPOINT, { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<User>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    getProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        try {
            const decoded: any = jwtDecode(token);

            const userId = decoded.id || decoded.sub || decoded.UserId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

            if (!userId) throw new Error('User ID not found in token');

            const response = await api.get<User>(`${ENDPOINT}/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to decode token or fetch profile:", error);
            throw error;
        }
    },

    create: async (data: UserRequest) => {
        const response = await api.post<User>(ENDPOINT, data);
        return response.data;
    },

    update: async (id: string, data: UserRequest) => {
        const response = await api.put<User>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    updateProfile: async (data: UserRequest) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const decoded: any = jwtDecode(token);
        const userId = decoded.id || decoded.sub || decoded.UserId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        const response = await api.put<User>(`${ENDPOINT}/${userId}`, data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest) => {
        const response = await api.put<void>('/Auth/UpdatePassword', data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<void>(`${ENDPOINT}/${id}`);
        return response.data;
    }
};
