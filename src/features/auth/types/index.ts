import { ApiResponse } from '@/types/common';

export interface AuthRequest {
    email: string;
    password?: string;
}

export interface AuthData {
    jwtToken: string;
    refreshToken: string;
}

export type AuthResponse = ApiResponse<AuthData>;

export interface RefreshTokenRequest {
    accessToken: string;
    refreshToken: string;
}

export interface UpdatePasswordRequest {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}
