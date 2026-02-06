"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role } from "../types"
import { RoleDialog } from "./role-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { roleService } from "../services"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const columns: ColumnDef<Role>[] = [
    {
        id: "no",
        header: () => <div className="text-center w-10">No.</div>,
        cell: ({ row }) => <div className="text-center w-10">{row.index + 1}</div>,
        size: 40,
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: "Nama Peran",
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
    },
    {
        accessorKey: "createdAt",
        header: "Dibuat Pada",
        cell: ({ row }) => {
            const value = row.getValue("createdAt") as string
            if (!value) return "-"
            return new Date(value).toLocaleString('id-ID')
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Diperbarui Pada",
        cell: ({ row }) => {
            const value = row.getValue("updatedAt") as string
            if (!value) return "-"
            return new Date(value).toLocaleString('id-ID')
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const role = row.original
            return <ActionCell role={role} />
        },
    },
]

function ActionCell({ role }: { role: Role }) {
    const queryClient = useQueryClient()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: roleService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
            toast.success("Peran berhasil dihapus")
        },
        onError: (error: any) => {

            toast.error("Gagal menghapus peran. Pastikan peran ini TIDAK sedang digunakan oleh pengguna manapun.")
        }
    })

    if (!mounted) return null

    return (
        <div className="flex space-x-2">
            <RoleDialog
                role={role}
                trigger={
                    <Button variant="ghost" size="icon" suppressHydrationWarning title="Ubah Peran">
                        <Edit className="h-4 w-4" />
                    </Button>
                }
            />
            {role.isLocked ? (
                <Button variant="ghost" size="icon" className="text-muted-foreground cursor-not-allowed" disabled title="Peran Sistem tidak dapat dihapus">
                    <Trash2 className="h-4 w-4" />
                </Button>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive" title="Hapus Peran (Pastikan tidak ada Pengguna terkait)">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Peran "{role.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan.
                                <br /><br />
                                <strong>PENTING:</strong> Jika Peran ini sedang digunakan oleh Pengguna, penghapusan akan <strong>GAGAL</strong> secara otomatis demi menjaga integritas data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(role.id)} className="bg-red-600 hover:bg-red-700">
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
