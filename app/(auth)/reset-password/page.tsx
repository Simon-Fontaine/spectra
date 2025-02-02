import { ResetPasswordForm } from "@/components/forms/resetpassword-form";
import { APP_LOGO } from "@/config/config-ui";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your account password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { token } = await props.searchParams;

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
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
