"use client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Ensure DialogTitle is imported
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Header } from "./header";


export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const {data:cardData}=useQuery<CardWithList>({
    queryKey:["card",id],
    queryFn:()=>fetcher(`/api/cards/${id}`),

  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Card</DialogTitle>
        {!cardData?<Header.Skeleton/>
          :<Header data={cardData}/>
        }
       </DialogContent>
    </Dialog>
  );
}; 
