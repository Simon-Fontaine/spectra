import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, CircleCheckIcon, CircleHelpIcon } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <>
      {"success" in message && (
        <Alert>
          <CircleCheckIcon className="h-[1.2rem] w-[1.2rem]" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{message.success}</AlertDescription>
        </Alert>
      )}
      {"error" in message && (
        <Alert variant="destructive">
          <CircleAlertIcon className="h-[1.2rem] w-[1.2rem]" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}
      {"message" in message && (
        <Alert>
          <CircleHelpIcon className="h-[1.2rem] w-[1.2rem]" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{message.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
