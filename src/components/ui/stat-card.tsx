import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    isLoading?: boolean
    className?: string
    variant?: "purple" | "red" | "blue" | "green" | "orange" | "cyan"
}

const VARIANTS = {
    purple: {
        iconBg: "bg-purple-100 dark:bg-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    red: {
        iconBg: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
    },
    blue: {
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    green: {
        iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
        iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    orange: {
        iconBg: "bg-orange-100 dark:bg-orange-900/20",
        iconColor: "text-orange-600 dark:text-orange-400",
    },
    cyan: {
        iconBg: "bg-cyan-100 dark:bg-cyan-900/20",
        iconColor: "text-cyan-600 dark:text-cyan-400",
    }
}

export function StatCard({ title, value, icon: Icon, isLoading, className, variant = "blue" }: StatCardProps) {
    const styles = VARIANTS[variant]

    return (
        <div className={cn(
            "bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800",
            "transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-zinc-700",
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {title}
                    </p>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {value}
                        </p>
                    )}
                </div>
                <div className="ml-4">
                    <div className={cn("p-3 rounded-full", styles.iconBg)}>
                        <Icon className={cn("h-6 w-6", styles.iconColor)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
