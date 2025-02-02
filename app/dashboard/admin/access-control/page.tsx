import { DataTable } from "@/components/data-table/data-table";
import { PageHeaderHeading } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { columns, filterFields } from "./_components/columns";
import { InviteUserDialog } from "./_components/invite-user-dialog";

export default async function DashboardAdminAccessControlPage() {
  const invitations = await prisma.invitation.findMany({});

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>Access Control</PageHeaderHeading>

      <DataTable
        data={invitations}
        columns={columns}
        filterFields={filterFields}
        initialState={{
          columnPinning: { right: ["actions"] },
          sorting: [{ id: "createdAt", desc: true }],
        }}
      >
        <InviteUserDialog />
      </DataTable>
    </div>
  );
}
