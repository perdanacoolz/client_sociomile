import api from '@/lib/axios';
import { AuthData, AuthRequest, RefreshTokenRequest, UpdatePasswordRequest } from '../types';

const ENDPOINT = '/Auth';

export const authService = {
    login: async (data: AuthRequest) => {
        const response = await api.post<AuthData>(`${ENDPOINT}/Login`, data);
        return response.data;
    },

    refreshToken: async (data: RefreshTokenRequest) => {
        const response = await api.post<AuthData>(`${ENDPOINT}/RefreshToken`, data);
        return response.data;
    },

    updatePassword: async (data: UpdatePasswordRequest) => {
        const response = await api.put<void>(`${ENDPOINT}/UpdatePassword`, data);
        return response.data;
    }
};
