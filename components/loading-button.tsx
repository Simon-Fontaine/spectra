import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function LoadingButton({
  pending,
  pendingText,
  children,
  type = "submit",
  ...props
}: ButtonProps & {
  pending: boolean;
  pendingText?: string;
  children: React.ReactNode;
}) {
  return (
    <Button type={type} disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2Icon className="animate-spin" />
          <span>{pendingText || "Loading..."}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
