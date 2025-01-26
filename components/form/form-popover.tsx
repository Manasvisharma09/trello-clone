"use client";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const router=useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log({ data });
      toast.success("Board created!");
      closeRef.current?.click();
      router.push(`/board/${data.id}`)
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error|| "Failed to create board.");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please provide a title.");
      return;
    }

    if (!selectedImageId) {
      toast.error("Please select an image.");
      return;
    }

    const formData = {
      title,
      image: selectedImageId,
    };

    console.log("Form data submitted:", formData);
    execute(formData);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <FormPicker
          id="image-picker"
          onImageSelect={(id) => setSelectedImageId(id)}
          errors={{}}
        />
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              errors={fieldErrors}
            />
          </div>

          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
