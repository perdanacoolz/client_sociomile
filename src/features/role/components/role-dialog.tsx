"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { RoleForm } from "./role-form"
import { Role } from "../types"
import { Plus, Edit } from "lucide-react"

interface RoleDialogProps {
    role?: Role
    trigger?: React.ReactNode
}

export function RoleDialog({ role, trigger }: RoleDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button suppressHydrationWarning>
                        <Plus className="mr-2 h-4 w-4" /> Add Role
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Add Role"}</DialogTitle>
                </DialogHeader>
                <RoleForm role={role} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
