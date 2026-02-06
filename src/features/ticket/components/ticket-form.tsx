import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ticketService } from "@/features/ticket/services";
import type { Ticket, TicketRequest } from "../types";
import { useCompany } from "@/context/company-context";
import { useQuery } from "@tanstack/react-query";

const ticketSchema = z.object({
    title: z.string().min(1, "title wajib diisi"),
    description: z.string().min(1, "deskripsi wajib diisi"),
    status: z.string().min(0, "status wajib disini"),
     priority: z.string().min(0, "priority wajib diisi"),
   
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketFormProps {
    initialData?: Ticket;
    onSuccess: () => void;
}

export function MachineForm({ initialData, onSuccess }: TicketFormProps) {
    const { selectedTicketId } = useCompany();

    const { data: ticketsData } = useQuery({
        queryKey: ['tickets-list', selectedTicketId],
        queryFn: () => ticketService.getAll({
            Page: 1,
            PageSize: 100,
            Sorts: 'title',
            Filters: `ID|eq|${selectedTicketId}`
        }),
        enabled: !!selectedTicketId
    });

    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            status: initialData?.status || "",
            priority: initialData?.priority || "",
          
        },
    });

    const mutation = useMutation({
        mutationFn: (data: TicketFormValues) => {
            // Convert empty strings to null for optional fields
            const payload: TicketRequest = {
               
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
               
            };

            if (initialData?.id) {
                return ticketService.update(initialData.id, payload);
            }
            return ticketService.create(payload);
        },
        onSuccess: () => {
            toast.success(initialData ? "ticket berhasil diperbarui" : "ticket berhasil dibuat");
            onSuccess();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.responseException?.exceptionMessage
                || error.response?.data?.message
                || error.response?.data?.title
                || error.response?.data?.errors
                || "Gagal menyimpan ticket";
            toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        },
    });

    const onSubmit = (data: TicketFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan title" {...field} />
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
                            <FormLabel>description *</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan deskripsi" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>status</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Masukkan status" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                   <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>priority</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Masukkan priority" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Menyimpan..." : initialData ? "Perbarui" : "Tambah"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
