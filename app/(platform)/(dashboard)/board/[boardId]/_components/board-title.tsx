"use client";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
    const {execute}=useAction(updateBoard,{
        onSuccess:(data)=>{
            toast.success(`Board"${data.title}"updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError:(error)=>{
            toast.error(error);
        }
    })
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title); // State to manage the title

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
   // setTitle(newTitle); // Update the title in state
    execute({
        title,
        id:data.id
    })
  };

  const handleBlur = () => {
    // Submit the form when input loses focus
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form
      action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
       // onSubmit={(e) => {
        //  e.preventDefault();
         // const formData = new FormData(e.currentTarget);
         // onSubmit(formData);
        
       // }}
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={handleBlur}
          defaultValue={title} // Use only the `value` prop
         // onChange={(e) => setTitle(e.target.value)} // Update state on input change
         // onBlur={handleBlur} // Handle blur to submit the form
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="form-hold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};
