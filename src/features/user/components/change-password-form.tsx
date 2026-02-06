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
import { useMutation } from "@tanstack/react-query"
import { userService } from "../services"
import { toast } from "sonner"
import { ChangePasswordRequest } from "../types"

const formSchema = z.object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z.string().min(6, "Kata sandi minimal harus 6 karakter"),
    confirmNewPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmNewPassword"],
})

export function ChangePasswordForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    })

    const mutation = useMutation({
        mutationFn: (values: ChangePasswordRequest) => userService.changePassword(values),
        onSuccess: () => {
            toast.success("Kata sandi berhasil diubah")
            form.reset()
        },
        onError: (error: any) => {
            toast.error("Gagal mengubah kata sandi: " + (error?.response?.data?.message || "Kesalahan server"))
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kata Sandi Saat Ini</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kata Sandi Baru</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Mengubah Kata Sandi..." : "Ubah Kata Sandi"}
                </Button>
            </form>
        </Form>
    )
}
