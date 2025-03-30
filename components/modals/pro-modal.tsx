"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const proModal = useProModal();

  const {execute,isLoading}=useAction(stripeRedirect,{
    onSuccess:(data)=>{
        window.location.href=data;
    },
    onError:(error)=>{
      toast.error(error);
    }
  })
  const onClick=()=>{
    execute({});
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-8 overflow-hidden rounded-lg">
        {/* Hero Image */}
        <div className="relative w-full h-40 flex items-center justify-center">
          <Image 
            src="/hero.svg" 
            alt="Hero" 
            className="object-contain"
            fill
          />
        </div>

        {/* Modal Content */}
        <div className="text-neutral-700 text-center space-y-4">
          <h2 className="text-xl font-semibold">Upgrade to Taskify Pro Today!</h2>
          <p className="text-sm font-medium text-neutral-600">
            Explore the best of Taskify
          </p>
          <ul className="text-sm text-left space-y-1 list-disc list-inside">
            <li>Unlimited Boards</li>
            <li>Advanced checklists</li>
            <li>Admin and security features</li>
            <li>And more!</li>
          </ul>
          <Button
          disabled={isLoading}
          onClick={onClick}
          className="w-full"
          variant="primary"
          >
            Upgrade
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};
