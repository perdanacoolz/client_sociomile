"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/features/user/services'
import { User } from '@/features/user/types'

export interface UserContextType {
    user: User | undefined
    isLoading: boolean
    error: any
    refetch: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: userService.getProfile,
        retry: 1,
    })

    return (
        <UserContext.Provider value={{ user, isLoading, error, refetch }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
