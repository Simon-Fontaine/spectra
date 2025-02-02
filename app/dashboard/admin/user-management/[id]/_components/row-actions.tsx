import LoadingButton from "@/components/loading-button";
import { useAction } from "next-safe-action/hooks";
import { useRef } from "react";
import { toast } from "sonner";
import { handleRevokeSession } from "../_lib/actions";

export const SessionRowActions = ({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) => {
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute: executeRevokeSession, isPending: isRevokeSessionPending } =
    useAction(handleRevokeSession, {
      onExecute: () => {
        toastRef.current = toast.loading("Revoking session...");
      },
      onSuccess: ({ data }) => {
        toast.success(data?.message, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
      onError: ({ error }) => {
        const { serverError, validationErrors } = error;

        let errorMessage =
          serverError || "Something went wrong. Please try again later.";

        if (validationErrors?.formErrors) {
          errorMessage = Object.values(validationErrors.formErrors).join(", ");
        }

        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    });

  return (
    <LoadingButton
      size="sm"
      type="button"
      variant="destructive"
      pendingText="Revoking..."
      pending={isRevokeSessionPending}
      onClick={() =>
        executeRevokeSession({
          userId: userId,
          sessionId: sessionId,
        })
      }
    >
      Revoke
    </LoadingButton>
  );
};
