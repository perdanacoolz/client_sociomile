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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userService } from "../services"
import { toast } from "sonner"
import { useEffect } from "react"
import { UserRequest } from "../types"

const formSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Alamat email tidak valid"),
    phoneNumber: z.string().min(0).default(""),

})

export function ProfileForm() {
    const queryClient = useQueryClient()


    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: userService.getProfile
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
        },
    })


    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber || "",
            })
        }
    }, [user, form])

    const mutation = useMutation({
        mutationFn: (data: UserRequest) => {
            return userService.updateProfile(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success("Profil berhasil diperbarui")
        },
        onError: (error: any) => {
            toast.error("Gagal memperbarui profil: " + (error?.response?.data?.message || "Kesalahan server"))
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        const payload: UserRequest = {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: "",
            roleId: user?.roleId || "",
            companyIds: user?.companyIds || [],
        };
        mutation.mutate(payload)
    }

    if (isLoading) {
        return <div>Memuat profil...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
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
                                <Input placeholder="budi@example.com" {...field} />
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
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                                <Input placeholder="08..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="space-y-2">
                    <FormLabel>Peran / Jabatan</FormLabel>
                    <Input value={user?.roleName || user?.roleCode || "-"} disabled className="bg-muted" />
                </div>

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </form>
        </Form>
    )
}
