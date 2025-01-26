"use client"
import { FormInput } from "@/components/form/form-input";
import { List } from "@prisma/client";
import { useState,useRef,ElementRef } from "react";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";
interface ListHeaderProps{
    data:List;
    onAddCard:()=> void;
} 

export const ListHeader=({
    data,
    onAddCard
}:ListHeaderProps)=>{
    const [title,setTitle]=useState(data.title);
    const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false); // Fixed typo

  const enableEditing = () => {
    setIsEditing(true); // Fixed typo
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }); // Added delay for better execution
  };
  const disableEditing = () => {
    setIsEditing(false);
  };
  const {execute}=useAction(updateList,{
    onSuccess:(data)=>{
        toast.success(`Renamed to "${data.title}"`)
        setTitle(data.title);
        disableEditing();
    },
    onError:(error)=>{
        toast.error(error);
    }
  })
  const handleSubmit=(formdata:FormData)=>{
    const title=formdata.get("title")as string;
    const id=formdata.get("id")as string;
    const boardId=formdata.get("boardId")as string;
    if(title===data.title){
        return disableEditing();
    }
    execute({
        title,
        id,
        boardId
    })
  }
  const onBlur=()=>{
    formRef.current?.requestSubmit();
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };
  useEventListener("keydown",onKeyDown)
    return(
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start-gap-x-2">
            {isEditing?(
                    <form 
                    ref={formRef}
                    action={handleSubmit}
                    className="flex-1 px-[2px]">
                        <input hidden id="id" name="id" value={data.id}/>
                        <input hidden id="boardId" name="boardId" value={data.boardId}/>
                        <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="enter list title .."
                        defaultValue={title}
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white "
                        />
                        <button type="submit" hidden />
                    </form>
            ):(
                <div 
                onClick={enableEditing}
                className=" w-full text-sm px-2.5 py-1 h-7 font-medium border-transport">
                 {title}
               </div>
          

            )}
            <ListOptions
            onAddCard={onAddCard}
            data={data}
            />
            
        </div>
    )
}