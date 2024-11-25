import { createOnboardingAction } from "@/app/(home)/onboarding/actions";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/utils/profile";

const roleOptions: { value: Profile["ow_role"]; label: string }[] = [
  { value: "main_tank", label: "Main Tank" },
  { value: "off_tank", label: "Off Tank" },
  { value: "flex_dps", label: "Flex DPS" },
  { value: "hitscan_dps", label: "Hitscan DPS" },
  { value: "main_heal", label: "Main Support" },
  { value: "flex_heal", label: "Flex Support" },
];

export default async function OnboardingPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>Welcome aboard!</PageHeaderHeading>
        <PageHeaderDescription>
          Let's set up your {siteConfig.name} profile to get started.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6 mx-auto max-w-xl">
        <form className="flex flex-col gap-2" action={createOnboardingAction}>
          <FormMessage message={searchParams} />

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              pattern="^[a-zA-Z0-9_]{1,32}$"
              title="Letters, numbers, and underscores only (1-32 characters)"
            />
            <p className="text-sm text-muted-foreground">
              Letters, numbers, and underscores only (1-32 characters)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput name="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordInput name="confirmPassword" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ow_role">Role</Label>
            <Select name="ow_role" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your main role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your primary Overwatch role
            </p>
          </div>

          <SubmitButton pendingText="Setting up your profile...">
            Complete Setup
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
