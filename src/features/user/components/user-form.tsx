"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { User, UserRequest } from "@/features/user/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { userService } from "@/features/user/services";
import { toast } from "sonner"
import { useEffect } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { roleService } from "@/features/role/services"

const formSchema = z.object({
    name: z.string().min(2, "Nama minimal harus 2 karakter"),
    email: z.string().email("Alamat email tidak valid"),
    phoneNumber: z.string().min(0).default(""),
    password: z.string().min(0).optional(),
    roleId: z.string().min(1, "Peran wajib dipilih"),
})

interface UserFormProps {
    initialData?: User | null
    onSuccess: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
    const queryClient = useQueryClient()


    const { data: rolesData } = useQuery({
        queryKey: ['roles-select'],
        queryFn: () => roleService.getAll({ PageSize: 100 })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            roleId: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber || "",
                password: "",
                roleId: initialData.roleId || "",
            })
        }
    }, [initialData, form])

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            const payload: UserRequest = {
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber || undefined,
                roleId: values.roleId,
                password: values.password || undefined
            }

            if (initialData) {
                return userService.update(initialData.id, payload)
            } else {
                if (!values.password) throw new Error("Kata sandi wajib diisi untuk pengguna baru")
                return userService.create(payload)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success(initialData ? "Pengguna berhasil diperbarui" : "Pengguna baru berhasil dibuat")
            onSuccess()
            form.reset()
        },
        onError: (error: any) => {
            toast.error("Gagal menyimpan: " + (error?.response?.data?.message || "Kesalahan server"))
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
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: Budi Santoso" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alamat Email</FormLabel>
                            <FormControl>
                                <Input placeholder="budi@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: 08123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Peran / Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih peran" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {rolesData?.items?.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{initialData ? "Kata Sandi Baru (Kosongkan jika tidak ingin diubah)" : "Kata Sandi"}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? "Menyimpan..." : (initialData ? "Perbarui Pengguna" : "Simpan Pengguna")}
                </Button>
            </form>
        </Form>
    )
}
