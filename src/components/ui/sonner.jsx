
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            className="toaster group"
            position="top-right"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-slate-500",
                    actionButton:
                        "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
                    cancelButton:
                        "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
                    success: "!text-green-600 !border-green-200 !bg-green-50",
                    error: "!text-red-600 !border-red-200 !bg-red-50",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
