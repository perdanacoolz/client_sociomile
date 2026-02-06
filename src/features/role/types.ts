import { BaseEntity } from "@/types/common";

export interface Role extends BaseEntity {
    name: string;
    description?: string;
    isLocked: boolean;
}

export interface RoleRequest {
    name: string;
    description?: string;
}
