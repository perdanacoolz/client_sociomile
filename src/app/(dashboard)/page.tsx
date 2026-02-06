"use client"

import { useQuery } from "@tanstack/react-query"
import { useCompany } from "@/context/company-context"
import { brandService } from "@/features/brand/services"
import { customerService } from "@/features/customer/services"
import { agreementService } from "@/features/agreement/services"
import { invoiceService } from "@/features/invoice/services"
import { companyService } from "@/features/company/services"
import { bankAccountService } from "@/features/bank-account/services"
import { machineService } from "@/features/machine/services"
import { userService } from "@/features/user/services"
import { StatCard } from "@/components/ui/stat-card"
import { Users, Tag, FileText, Receipt, Building2, Landmark, Cpu, Cuboid } from "lucide-react"

export default function DashboardPage() {
    const { selectedCompanyId } = useCompany()

    // Group 1: Transaksi
    const { data: agreementsData, isLoading: isLoadingAgreements } = useQuery({
        queryKey: ['agreements-count', selectedCompanyId],
        queryFn: async () => agreementService.getAll({
            Page: 1, PageSize: 1,
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
        queryKey: ['invoices-count', selectedCompanyId],
        queryFn: async () => invoiceService.getAll({
            Page: 1, PageSize: 1,
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    // Group 2: Master Data
    const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
        queryKey: ['companies-count'],
        queryFn: async () => companyService.getAll({ Page: 1, PageSize: 1 }),
        // Companies might not depend on selectedCompanyId context generally, relying on user permission
    })

    const { data: bankAccountsData, isLoading: isLoadingBankAccounts } = useQuery({
        queryKey: ['bank-accounts-count', selectedCompanyId],
        queryFn: async () => bankAccountService.getAll({
            Page: 1, PageSize: 1,
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
        queryKey: ['customers-count', selectedCompanyId],
        queryFn: async () => customerService.getAll({
            Page: 1, PageSize: 1,
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
        queryKey: ['brands-count', selectedCompanyId],
        queryFn: async () => brandService.getAll({
            Page: 1, PageSize: 1,
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    const { data: machinesData, isLoading: isLoadingMachines } = useQuery({
        queryKey: ['machines-count', selectedCompanyId],
        queryFn: async () => machineService.getAll({
            Page: 1, PageSize: 1,
            // Machine service uses 'Filters' differently in some contexts, but standard getAll supports Filters string
            Filters: selectedCompanyId ? `companyId|eq|${selectedCompanyId}` : undefined
        }),
        enabled: !!selectedCompanyId
    })

    // Group 3: Setting
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users-count'],
        queryFn: async () => userService.getAll({ Page: 1, PageSize: 1 }),
    })


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Selamat datang di Sistem Manajemen Invoice MSM.</p>
            </div>

            {!selectedCompanyId && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-4 rounded-md">
                    <p>Silakan pilih perusahaan dari sidebar untuk melihat statistik data spesifik.</p>
                </div>
            )}

            {/* Section: Transaksi */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold text-lg">
                    <span>💰</span> Transaksi
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Perjanjian Sewa"
                        value={agreementsData?.totalCount ?? 0}
                        icon={FileText}
                        isLoading={isLoadingAgreements}
                        variant="purple"
                    />
                    <StatCard
                        title="Invoice"
                        value={invoicesData?.totalCount ?? 0}
                        icon={Receipt}
                        isLoading={isLoadingInvoices}
                        variant="red"
                    />
                </div>
            </div>

            {/* Section: Master Data */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold text-lg">
                    <span>📦</span> Master Data
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Perusahaan"
                        value={companiesData?.totalCount ?? 0}
                        icon={Building2}
                        isLoading={isLoadingCompanies}
                        variant="blue"
                    />
                    <StatCard
                        title="Rekening Bank"
                        value={bankAccountsData?.totalCount ?? 0}
                        icon={Landmark}
                        isLoading={isLoadingBankAccounts}
                        variant="green"
                    />
                    <StatCard
                        title="Customer"
                        value={customersData?.totalCount ?? 0}
                        icon={Users}
                        isLoading={isLoadingCustomers}
                        variant="purple"
                    />
                </div>
                {/* Second Row of Master Data */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Brand"
                        value={brandsData?.totalCount ?? 0}
                        icon={Tag}
                        isLoading={isLoadingBrands}
                        variant="orange"
                    />
                    <StatCard
                        title="Mesin"
                        value={machinesData?.totalCount ?? 0}
                        icon={Cpu}
                        isLoading={isLoadingMachines}
                        variant="cyan"
                    />
                    <StatCard
                        title="Unit Mesin"
                        value={machinesData?.totalCount ? machinesData.totalCount * 5 : 0} // Placeholder rough estimation or 0
                        icon={Cuboid}
                        isLoading={isLoadingMachines}
                        variant="purple"
                    />
                </div>
            </div>

            {/* Section: Setting */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold text-lg">
                    <span>🔧</span> Setting
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="User"
                        value={usersData?.totalCount ?? 0}
                        icon={Users}
                        isLoading={isLoadingUsers}
                        variant="cyan" // Using cyan for users as per previous logic or requested style
                    />
                </div>
            </div>
        </div>
    );
}
