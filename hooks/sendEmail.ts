import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"


export const useSendEmail = () => {
    const trpc = useTRPC()
    
    return useMutation(trpc.email.sendWelcome.mutationOptions({
        onSuccess: (data) => {
            toast.success("Welcome to Viewify")
        },
        onError: (error) => {
            toast.error("We are having trouble fully signing you up. Please email 'mjkamdar04@gmail.com' to receive up to date emails.")
        }
    }))
}