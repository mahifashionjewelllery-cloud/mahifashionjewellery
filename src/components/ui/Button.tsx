import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-accent text-accent-foreground hover:bg-accent/90': variant === 'primary',
                        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'secondary',
                        'border border-accent text-accent hover:bg-accent hover:text-accent-foreground': variant === 'outline',
                        'hover:bg-accent/10 hover:text-accent': variant === 'ghost',
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-8 py-2': size === 'md',
                        'h-12 px-10 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
