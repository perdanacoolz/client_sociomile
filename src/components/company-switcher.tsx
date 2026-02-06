"use client"

import * as React from "react"
import { Building2, ChevronsUpDown, Check, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCompany } from "@/context/company-context"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "@/features/company/services"
import { useRouter } from "next/navigation"

export function CompanySwitcher() {
    const { selectedCompanyId, setSelectedCompanyId } = useCompany()
    const [open, setOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const { data } = useQuery({
        queryKey: ['companies-all'],
        queryFn: () => companyService.getAll({ PageSize: 100 }),
    })

    const companies = data?.items || []
    const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

    if (!mounted) {
        return (
            <Button
                variant="outline"
                className="w-full justify-between"
                disabled
            >
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0 opacity-50" />
                    Loading...
                </div>
            </Button>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedCompany ? (
                        <div className="flex items-center gap-2 truncate">
                            <Building2 className="h-4 w-4 shrink-0 opacity-50" />
                            <span className="truncate">{selectedCompany.name}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4 shrink-0 opacity-50" />
                            Pilih Perusahaan...
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Cari perusahaan..." />
                    <CommandList>
                        <CommandEmpty>Perusahaan tidak ditemukan.</CommandEmpty>
                        <CommandGroup heading="Perusahaan">
                            {companies.map((company) => (
                                <CommandItem
                                    key={company.id}
                                    onSelect={() => {
                                        setSelectedCompanyId(company.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCompanyId === company.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {company.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false)
                                router.push("/company")
                            }}>
                                <Plus className="mr-2 h-5 w-5" />
                                Buat Perusahaan
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
