"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { type ComponentProps } from "react";
import { useFormState } from "react-hook-form";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}
      {isSubmitting ? pendingText : children}
    </Button>
  );
}
