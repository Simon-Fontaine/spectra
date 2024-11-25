import { requireProfile } from "@/utils/profile";

export default async function DashboardPage() {
  const profile = await requireProfile();

  return (
    <div>
      <h1>Welcome, {profile.username}!</h1>
      <div>Role: {profile.ow_role}</div>
      {profile.is_substitute && <div>Substitute Player</div>}
    </div>
  );
}
