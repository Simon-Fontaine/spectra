import { forgotPasswordAction } from "@/app/actions";
import AuthFooter from "@/components/auth-footer";
import AuthHeader from "@/components/auth-header";
import { FormMessage, Message } from "@/components/form-message";
import NavigationButtons from "@/components/navigation-buttons";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="container flex h-screen w-screen flex-col items-center justify-center">
      <NavigationButtons />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthHeader
          title="Welcome back"
          subtitle="Enter your email to reset your password"
        />
        <form className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              name="email"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>
          <SubmitButton
            formAction={forgotPasswordAction}
            pendingText="Sending Reset Link..."
          >
            Send Reset Link
          </SubmitButton>
        </form>
        <FormMessage message={searchParams} />
        <AuthFooter
          links={[{ name: "Found your password? Sign in", href: "/sign-in" }]}
        />
      </div>
    </main>
  );
}
