"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    CreditCard,
    Home,
    LayoutDashboard,
    Settings,
    Users,
    FileText,
    Building2,
    Tags,
    LogOut,
    Menu,
    Shield,

    Terminal,
    Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyProvider } from "@/context/company-context"
import { UserProvider, useUser } from "@/context/user-context"
import { CompanySwitcher } from "@/components/company-switcher"




const sidebarItems = [
    { icon: Home, label: "Beranda", href: "/" },
    {
        label: "Data Master",
        isHeader: true
    },
    { icon: CreditCard, label: "Akun Bank", href: "/bank-account" },
    { icon: Tags, label: "Brand", href: "/brand" },
    { icon: Building2, label: "Perusahaan", href: "/company" },
    { icon: Wrench, label: "Mesin", href: "/machine" },

    { icon: Users, label: "Pelanggan", href: "/customer" },
    { icon: Users, label: "Pengguna", href: "/user" },
    { icon: Shield, label: "Peran", href: "/role" },
    {
        label: "Transaksi",
        isHeader: true
    },
    { icon: FileText, label: "Perjanjian", href: "/agreement" },
    { icon: FileText, label: "Invoice", href: "/invoice" },
    {
        label: "Sistem",
        isHeader: true
    },
    { icon: Terminal, label: "Playground", href: "/playground" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isCollapsed = !isSidebarOpen;

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/login");
        }
    }, [router]);



    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    return (
        <CompanyProvider>
            <UserProvider>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </UserProvider>
        </CompanyProvider >
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isCollapsed = !isSidebarOpen;
    const { user, isLoading } = useUser();


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            <div className="flex-1 px-4 space-y-2 overflow-auto py-4 font-[family-name:var(--font-outfit)]">
                {sidebarItems.map((item, index) => {
                    if (item.isHeader) {
                        if (!isMobile && isCollapsed) return <div key={index} className="border-b my-2" />
                        return (
                            <div key={index} className="px-2 py-2 mt-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider font-sans">
                                {item.label}
                            </div>
                        );
                    }
                    const Icon = item.icon as any;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href!}
                            onClick={() => isMobile && setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                                    : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50",
                                !isMobile && isCollapsed && "justify-center px-2"
                            )}
                            title={!isMobile && isCollapsed ? item.label : undefined}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600")} />
                            {(isMobile || !isCollapsed) && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-gray-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            suppressHydrationWarning
                            className={cn(
                                "w-full h-12 p-2 flex items-center gap-3 hover:bg-zinc-100",
                                !isMobile && isCollapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold shrink-0 text-xs border border-zinc-200 dark:border-zinc-700">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            {(isMobile || !isCollapsed) && (
                                <div className="text-sm text-left overflow-hidden">
                                    <p className="font-medium text-zinc-900 truncate font-[family-name:var(--font-outfit)]">{user?.name || "Loading..."}</p>
                                    <p className="text-xs text-zinc-500 truncate font-[family-name:var(--font-outfit)]">{user?.email || "..."}</p>
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 ml-2">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <Users className="mr-2 h-4 w-4" />
                            Profil & Keamanan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-950">
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col bg-white text-zinc-900 border-r border-gray-200 fixed h-full inset-y-0 z-50 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <div className={cn("h-16 flex items-center justify-between border-b border-gray-100 transition-all shrink-0", isCollapsed ? "px-4" : "px-6")}>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate font-[family-name:var(--font-playfair)] tracking-wide">
                            MSM Invoice
                        </h1>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={cn("ml-auto", isCollapsed && "mx-auto")}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu Navigasi</SheetTitle>
                        <SheetDescription>Menu navigasi utama untuk Sistem Manajemen Invoice MSM</SheetDescription>
                    </SheetHeader>
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate font-[family-name:var(--font-playfair)] tracking-wide" aria-hidden="true">
                            MSM Invoice
                        </h1>
                    </div>
                    <SidebarContent isMobile />
                </SheetContent>
            </Sheet>

            <main className={cn(
                "flex-1 transition-all duration-300 min-w-0",
                isCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6 shadow-sm">
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block min-w-[200px]">
                            <CompanySwitcher />
                        </div>
                        <div className="text-xs text-muted-foreground italic">
                            created by gilang
                        </div>
                    </div>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
