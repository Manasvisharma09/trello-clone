import { ModalProvider } from "@/components/Providers/modal-provider";
import { QueryProvider } from "@/components/Providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "sonner"

const platformLayout=({
    children

}: {
    children:React.ReactNode;

})=>{
    return(
        <ClerkProvider>
            <QueryProvider>
            <Toaster/>
            <ModalProvider/>
            {children}
            </QueryProvider>
        </ClerkProvider>
    )
}
export default platformLayout;