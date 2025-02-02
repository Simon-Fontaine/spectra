import { SignInForm } from "@/components/forms/signin-form";
import {} from "@/components/ui/alert";
import { APP_LOGO } from "@/config/config-ui";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import type { Metadata } from "next";
import Link from "next/link";

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
          <div className="rounded-xl border bg-green-100 p-4 text-green-800 shadow">
            Your email has been confirmed. You can now log in below.
          </div>
        )}
        <SignInForm />
      </div>
    </div>
  );
}
