import OnboardingPage from "@/components/onboarding-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your onboarding process",
};

export default async function UserOnboardingPage() {
  return <OnboardingPage />;
}
