import { Message } from "@/components/form-message";
import ProfileSettingsPage from "@/components/profile-settings-page";
import { requireProfile } from "@/utils/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update your profile settings",
};

export default async function DashboardProfileSettingsPage(props: {
  searchParams: Promise<Message>;
}) {
  const userData = await requireProfile();
  const searchParams = await props.searchParams;

  const profile = userData.profile!;
  const user = userData.user;

  return (
    <ProfileSettingsPage profile={profile} user={user} message={searchParams} />
  );
}
