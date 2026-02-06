import { BaseEntity } from "@/types/common";

export interface User extends BaseEntity {
    name: string;
    email: string;
    phoneNumber?: string;
    roleId?: string;
    roleCode?: string;
    roleName?: string;
    companyIds?: string[];
}

export interface UserRequest {
    name: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    roleId?: string;
    companyIds?: string[];
    roles?: string[];
}

export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}
