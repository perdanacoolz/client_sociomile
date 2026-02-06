"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface CompanyContextType {
    selectedCompanyId: string | null
    setSelectedCompanyId: (id: string | null) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)


    useEffect(() => {
        const storedId = localStorage.getItem("selectedCompanyId")
        if (storedId) {
            setSelectedCompanyId(storedId)
        }
    }, [])


    const handleSetCompanyId = (id: string | null) => {
        setSelectedCompanyId(id)
        if (id) {
            localStorage.setItem("selectedCompanyId", id)
        } else {
            localStorage.removeItem("selectedCompanyId")
        }
    }

    return (
        <CompanyContext.Provider value={{ selectedCompanyId, setSelectedCompanyId: handleSetCompanyId }}>
            {children}
        </CompanyContext.Provider>
    )
}

export function useCompany() {
    const context = useContext(CompanyContext)
    if (context === undefined) {
        throw new Error("useCompany must be used within a CompanyProvider")
    }
    return context
}
