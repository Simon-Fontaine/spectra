import Link from "next/link";
import { Metadata } from "next";
import { CheckCircle2Icon } from "lucide-react";
import { APP_LOGO } from "@/config/config-ui";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { SignInForm } from "@/components/forms/signin-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

interface SignInPageProps {
  searchParams: Promise<{ verified: string }>;
}

export default async function SignInPage(props: SignInPageProps) {
  const { verified } = await props.searchParams;
  const isVerified = verified === "true";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex items-center justify-center ">
            <APP_LOGO height={30} width={30} />
          </div>
          {APP_CONFIG_PUBLIC.APP_NAME}
        </Link>
        {isVerified && (
          <Alert className="rounded-xl border shadow">
            <CheckCircle2Icon className="h-4 w-4" />
            <AlertTitle>Email verified!</AlertTitle>
            <AlertDescription>
              Your email has been confirmed. You can now log in below.
            </AlertDescription>
          </Alert>
        )}
        <SignInForm />
      </div>
    </div>
  );
}
