import { PageHeaderHeading } from "@/components/page-header";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardAdminUsersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profile").select("*");

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      {/* Page Title */}
      <PageHeaderHeading>User Management</PageHeaderHeading>
    </div>
  );
}
