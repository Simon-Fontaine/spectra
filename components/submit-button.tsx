"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? pendingText : children}
    </Button>
  );
}
