"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { machineService } from "@/features/ticket/services"
import { Machine } from "@/features/ticket/types"
import { Plus, MoreHorizontal, Pencil, Trash, Search, Settings2, SortAsc, SortDesc, ArrowDownAz, ArrowUpAz, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { VisibilityState, ColumnDef, SortingState } from "@tanstack/react-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MachineForm } from "@/features/machine/components/machine-form"

export default function MachinePage() {
    const queryClient = useQueryClient()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorts, setSorts] = useState("-createdAt")
    const [sorting, setSorting] = useState<SortingState>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        code: false,
        brandId: false,
        createdAt: false,
        updatedAt: false,
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setPagination(prev => ({ ...prev, pageIndex: 0 }))
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const sortParam = sorting.map(s => {
        return s.desc ? `-${s.id}` : s.id
    }).join(',')

    const { data, isLoading } = useQuery({
        queryKey: ['machines', pagination, sorting, sorts, debouncedSearch],
        queryFn: () => {
            const filtersParts = []
            if (debouncedSearch) {
                filtersParts.push(`(name|code|description)@=*${debouncedSearch}`)
            }

            const finalSort = sorting.length > 0 ? sortParam : sorts;

            return machineService.getAll({
                Page: pagination.pageIndex + 1,
                PageSize: pagination.pageSize,
                Sorts: finalSort,
                Filters: filtersParts.length > 0 ? filtersParts.join(',') : undefined
            })
        },
        placeholderData: keepPreviousData,
    })

    const machines = data?.items || []
    const pageCount = Math.ceil((data?.totalCount || 0) / pagination.pageSize)
    const editingData = machines.find(item => item.id === editingId)

    const handleEdit = (id: string) => {
        setEditingId(id)
        setIsOpen(true)
    }

    const handleAddNew = () => {
        setEditingId(null)
        setIsOpen(true)
    }

    const handleSuccess = () => {
        setIsOpen(false)
        setEditingId(null)
        queryClient.invalidateQueries({ queryKey: ['machines'] })
    }

    const deleteMutation = useMutation({
        mutationFn: (id: string) => machineService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['machines'] })
            toast.success("Mesin berhasil dihapus")
        },
        onError: (error) => {
            console.error("Delete Error:", error)
            toast.error("Gagal menghapus mesin")
        }
    })

    const handleDeleteClick = (id: string) => {
        setDeleteId(id)
        setIsDeleteOpen(true)
    }

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId)
            setIsDeleteOpen(false)
        }
    }

    const columns: ColumnDef<Machine>[] = [
        {
            id: "no",
            header: () => <div className="text-center w-10">No.</div>,
            cell: ({ row }) => <div className="text-center w-10">{(pagination.pageIndex * pagination.pageSize) + row.index + 1}</div>,
            size: 40,
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama Mesin
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
        },
        {
            accessorKey: "code",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Kode
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
        },
        {
            accessorKey: "brandId",
            header: "ID Merek",
        },
        {
            accessorKey: "description",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Deskripsi
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => <div className="max-w-[300px] truncate" title={row.getValue("description")}>{row.getValue("description")}</div>
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Dibuat Pada
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const value = row.getValue("createdAt") as string
                if (!mounted || !value) return value || "-"
                return new Date(value).toLocaleString('id-ID')
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Diperbarui Pada
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const value = row.getValue("updatedAt") as string
                if (!mounted || !value) return value || "-"
                return new Date(value).toLocaleString('id-ID')
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original
                if (!mounted) return null

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(item.id)}
                            >
                                Salin ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(item.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Mesin</h1>
                    <p className="text-muted-foreground mt-1">Kelola data inventaris mesin Anda.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari mesin..."
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
                                            name: "Nama Mesin",
                                            code: "Kode",
                                            brandId: "ID Merek",
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
                        <Select
                            value={sorts}
                            onValueChange={(val) => {
                                setSorts(val)
                                setSorting([])
                            }}
                        >
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
                    <Button onClick={handleAddNew} className="h-9 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={machines}
                isLoading={isLoading}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                renderMobileCard={(row) => {
                    const item = row.original;
                    if (!mounted) return null;
                    return (
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 space-y-3 overflow-hidden">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 break-words">{item.name}</h3>
                                    {item.code && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">Kode: {item.code}</p>
                                    )}
                                    {item.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2">{item.description}</p>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
                                            Salin ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(item.id)}>
                                            <Trash className="mr-2 h-4 w-4" /> Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                }}
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Mesin" : "Tambah Mesin"}</DialogTitle>
                        <DialogDescription>
                            {editingId ? "Perbarui detail mesin." : "Buat mesin baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <MachineForm initialData={editingData} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus mesin secara permanen dan menghapus data Anda dari server kami.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
