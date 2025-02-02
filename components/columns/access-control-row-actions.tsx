import { handleRevokeInvitation } from "@/actions/admin-management";
import LoadingButton from "@/components/loading-button";
import { useAction } from "next-safe-action/hooks";
import { useRef } from "react";
import { toast } from "sonner";

export const InvitationRowActions = ({ email }: { email: string }) => {
  const toastRef = useRef<string | number | undefined>(undefined);

  const {
    execute: executeRevokeInvitation,
    isPending: isRevokeInvitationPending,
  } = useAction(handleRevokeInvitation, {
    onExecute: () => {
      toastRef.current = toast.loading("Revoking invitation...");
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
      pending={isRevokeInvitationPending}
      onClick={() =>
        executeRevokeInvitation({
          email,
        })
      }
    >
      Revoke
    </LoadingButton>
  );
};
