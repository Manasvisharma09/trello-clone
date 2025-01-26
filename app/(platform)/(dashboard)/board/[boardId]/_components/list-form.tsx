"use client";
import { FormInput } from "@/components/form/form-input";
import { ListWrapper } from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { useState, useRef, ElementRef, RefObject } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ListForm = () => {
  const router=useRouter();
  const parmas=useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false); // Fixed typo

  const enableEditing = () => {
    setIsEditing(true); // Fixed typo
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0); // Added delay for better execution
  };

  const disableEditing = () => {
    setIsEditing(false);
  };
  const {execute,fieldErrors}=useAction(createList,{
    onSuccess:(data)=>{
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();

    },
    onError:(error)=>{
      toast.error(error);
    }
  })
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown); // Fixed event name
  useOnClickOutside(formRef as RefObject<HTMLElement>, disableEditing);

  const onSumbit=(formData:FormData)=>{
    const title=formData.get("title") as string;
    const boardId=formData.get("boardId") as string;
    execute({
      title,
      boardId
    })
  }
  if(isEditing){
    return(
        <ListWrapper>
            <form
            action={onSumbit}
            ref={formRef}
            className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
            >
                <FormInput
                ref={inputRef}
                errors={fieldErrors}
                id="title"
                className="text-sm px-2 py-1 h-7 font-medium 
                border-transparent hover:border-input focus:harder-input  transition"
                placeholder="Enter list title"
                />
                <input
                hidden
                value={parmas.boardId}
                name="boardId"
                />
                <div className="flex item-center gap-x-1">
                    <FormSubmit>
                        Add list
                    </FormSubmit>
                    <Button
                    onClick={disableEditing}
                    variant="ghost"
                    >
                        <X className="h-5 w-5"/>
                    </Button>
                </div>

            </form>
        </ListWrapper>
    )
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing} // Added click event handler
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};
