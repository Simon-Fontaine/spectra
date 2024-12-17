import ProfileSettingsPage from "@/components/profile-settings-page";
import { requireProfile } from "@/utils/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update your profile settings",
};

export default async function DashboardProfileSettingsPage() {
  const profile = await requireProfile();

  return <ProfileSettingsPage profile={profile} />;
}
