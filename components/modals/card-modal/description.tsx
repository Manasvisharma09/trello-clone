"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useRef, ElementRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface DescriptionProps {
    data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey:["card-logs",data.id]
            })
            toast.success(`Card "${data.title}" updated`);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;

        execute({
            id: data.id,
            description,
            boardId,
        });

        disableEditing();
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Description</p>
                {isEditing ? (
                    <form onSubmit={onSubmit} ref={formRef} className="space-y-2">
                        <FormTextarea
                            id="description"
                            className="w-full mt-2"
                            placeholder="Add a more detailed description..."
                            defaultValue={data.description || ""}
                            errors={fieldErrors}
                            ref={textareaRef}
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>Save</FormSubmit>
                            <Button type="button" onClick={disableEditing} size="sm" variant="ghost">
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        role="button"
                        onClick={enableEditing}
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {data.description || "Add a more detailed description..."}
                    </div>
                )}
            </div>
        </div>
    );
};

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
                <Skeleton className="h-[78px] w-full bg-neutral-200" />
            </div>
        </div>
    );
};
