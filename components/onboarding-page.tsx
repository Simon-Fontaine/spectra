"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PasswordInput from "@/components/password-input";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./page-header";
import { siteConfig } from "@/config/site";
import { Input } from "./ui/input";
import { SubmitButton } from "./hook-form-submit-button";
import { Profile } from "@/utils/profile";

const roleOptions: { value: Profile["ow_role"]; label: string }[] = [
  { value: "main_tank", label: "Main Tank" },
  { value: "off_tank", label: "Off Tank" },
  { value: "flex_dps", label: "Flex DPS" },
  { value: "hitscan_dps", label: "Hitscan DPS" },
  { value: "main_heal", label: "Main Support" },
  { value: "flex_heal", label: "Flex Support" },
];

const roleValues = roleOptions.map((option) => option.value) as [
  string,
  ...string[],
];

const onboardingSchema = z
  .object({
    username: z
      .string()
      .regex(
        /^[a-z0-9_]{1,48}$/,
        "Username must be lowercase and contain only letters, numbers, and underscores"
      ),
    display_name: z
      .string()
      .regex(
        /^[a-zA-Z0-9_ ]{0,32}$/,
        "Display name must contain only letters, numbers, underscores, and spaces"
      ),
    ow_role: z.enum(roleValues),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

function handleErrorToast(toast: any, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "An unknown error occurred. Please try again later.";

  toast({
    variant: "destructive",
    title: "Error!",
    description: message,
  });
}

export default function OnboardingPage() {
  const supabase = createClient();

  const { toast } = useToast();
  const router = useRouter();

  const onboardingForm = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      display_name: "",
      password: "",
      confirmPassword: "",
      ow_role: "main_tank",
    },
  });

  async function handleOnboardingSubmit(
    data: z.infer<typeof onboardingSchema>
  ) {
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("profile")
        .select("id")
        .eq("username", data.username)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingUser) {
        return onboardingForm.setError("username", {
          message: "Username is already taken",
        });
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (passwordError) throw passwordError;

      const { error: profileError } = await supabase.from("profile").upsert({
        username: data.username,
        display_name: data.display_name || null,
        ow_role: data.ow_role as Profile["ow_role"],
        onboarding_completed: true,
      });

      if (profileError) throw profileError;

      toast({
        title: "Profile created!",
        description: "Your profile has been successfully created.",
      });

      router.push("/dashboard");
    } catch (error) {
      handleErrorToast(toast, error);
    }
  }

  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>Welcome aboard!</PageHeaderHeading>
        <PageHeaderDescription>
          Let's set up your {siteConfig.name} profile to get started.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6 mx-auto max-w-xl">
        <Form {...onboardingForm}>
          <form
            className="flex flex-col gap-2"
            onSubmit={onboardingForm.handleSubmit(handleOnboardingSubmit)}
          >
            <FormField
              control={onboardingForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="owspectra" />
                  </FormControl>
                  <FormDescription>
                    This is your URL namespace within the app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Spectra" />
                  </FormControl>
                  <FormDescription>
                    Enter your full name or display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="ow_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select your main role in Overwatch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Create your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter your new password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Confirm your new password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              className="mt-2"
              pendingText="Setting up your profile..."
            >
              Set up yout profile
            </SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
