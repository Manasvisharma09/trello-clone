"use client";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { FormErrors } from "./form-error";

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      required = false,
      disabled = false,
      errors,
      className,
      defaultValue = "",
      onBlur,
      value,
      onChange,
    },
    ref
  ) => {
    const { pending } = useFormStatus();
    
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="text-xs font-semibold text-neutral-700">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={pending || disabled}
          defaultValue={defaultValue}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          className={cn("text-sm px-2 py-1 h-7", className)}
          aria-describedby={`${id}-error`}
        />
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
