"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/features/role/components/columns"
import { RoleDialog } from "@/features/role/components/role-dialog"
import { roleService } from "@/features/role/services"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Settings2, SortAsc, SortDesc, ArrowDownAz, ArrowUpAz } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { VisibilityState } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"


export default function RolePage() {

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [sorts, setSorts] = useState("-createdAt")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        description: false,
    })


    const { data, isLoading } = useQuery({
        queryKey: ['roles', debouncedSearch, sorts],
        queryFn: () => roleService.getAll({
            Filters: debouncedSearch ? `(name|description)@=*${debouncedSearch}` : undefined,
            Sorts: sorts
        }),
        placeholderData: keepPreviousData,
    })

    const roles = data?.items || []
    const totalItems = data?.totalCount || 0
    const totalPages = data?.totalPages || 1

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Peran</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola peran pengguna dan hak akses jabatan dalam sistem.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari peran..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    {mounted && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-auto hidden sm:flex h-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                >
                                    <Settings2 className="mr-2 h-4 w-4 text-zinc-500" />
                                    Kolom
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {columns
                                    .filter((column) => (column as any).enableHiding !== false && (column.id || (column as any).accessorKey))
                                    .map((column) => {
                                        const colId = (column.id || (column as any).accessorKey) as string;
                                        const labels: Record<string, string> = {
                                            name: "Nama Peran",
                                            description: "Deskripsi",
                                            createdAt: "Dibuat Pada",
                                            updatedAt: "Diperbarui Pada",
                                        }
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={colId}
                                                className="capitalize"
                                                checked={columnVisibility[colId] !== false}
                                                onCheckedChange={(value) => {
                                                    setColumnVisibility((prev) => ({
                                                        ...prev,
                                                        [colId]: !!value,
                                                    }))
                                                }}
                                            >
                                                {labels[colId] || colId}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {mounted && (
                        <Select value={sorts} onValueChange={setSorts}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                                <SelectValue placeholder="Urutkan..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-createdAt">
                                    <div className="flex items-center gap-2">
                                        <SortDesc className="h-3.5 w-3.5" /> Terbaru
                                    </div>
                                </SelectItem>
                                <SelectItem value="createdAt">
                                    <div className="flex items-center gap-2">
                                        <SortAsc className="h-3.5 w-3.5" /> Terlama
                                    </div>
                                </SelectItem>
                                <DropdownMenuSeparator className="my-1" />
                                <SelectItem value="name">
                                    <div className="flex items-center gap-2">
                                        <ArrowDownAz className="h-3.5 w-3.5" /> Nama A-Z
                                    </div>
                                </SelectItem>
                                <SelectItem value="-name">
                                    <div className="flex items-center gap-2">
                                        <ArrowUpAz className="h-3.5 w-3.5" /> Nama Z-A
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <RoleDialog />
                </div>
            </div>



            <DataTable
                columns={columns}
                data={roles}
                isLoading={isLoading}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
            />
        </div>
    )
}
