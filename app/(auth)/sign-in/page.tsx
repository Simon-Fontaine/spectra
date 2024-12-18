import { signInAction } from "@/app/(auth)/actions";
import AuthFooter from "@/components/auth-footer";
import AuthHeader from "@/components/auth-header";
import { NotificationAlert, Message } from "@/components/form-message";
import NavigationButtons from "@/components/navigation-buttons";
import PasswordInput from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <main className="container flex h-screen w-screen flex-col items-center justify-center">
      <NavigationButtons loginButton={false} />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthHeader
          title="Welcome back"
          subtitle="Enter your email to sign in to your account"
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
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <PasswordInput name="password" />
          </div>
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
        </form>
        <NotificationAlert message={searchParams} />
        <AuthFooter
          links={[
            { name: "Lost your password? Reset it", href: "/forgot-password" },
          ]}
        />
      </div>
    </main>
  );
}
