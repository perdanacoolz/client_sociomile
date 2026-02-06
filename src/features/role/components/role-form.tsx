"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { roleService } from "../services"
import { toast } from "sonner"
import { Role, RoleRequest } from "../types"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, "Nama peran wajib diisi").max(32),
    description: z.string().max(256, "Deskripsi maksimal 256 karakter").optional(),
})

interface RoleFormProps {
    role?: Role
    onSuccess?: () => void
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: role?.name || "",
            description: role?.description || "",
        },
    })

    useEffect(() => {
        if (role) {
            form.reset({
                name: role.name,
                description: role.description || "",
            })
        }
    }, [role, form])

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            const payload: RoleRequest = {
                name: values.name,
                description: values.description || undefined,
            }
            if (role) {
                return roleService.update(role.id, payload)
            }
            return roleService.create(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
            toast.success(role ? "Peran berhasil diperbarui" : "Peran baru berhasil dibuat")
            onSuccess?.()
        },
        onError: (error: any) => {
            toast.error("Gagal menyimpan peran: " + (error?.response?.data?.message || "Kesalahan server"))
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Peran</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: Administrator" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Jelaskan hak akses atau kemampuan peran ini..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="submit" disabled={mutation.isPending} className="w-full">
                        {mutation.isPending ? "Menyimpan..." : (role ? "Perbarui Peran" : "Simpan Peran")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
