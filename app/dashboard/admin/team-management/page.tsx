import {
  columns,
  filterFields,
} from "@/components/columns/team-management-columns";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeaderHeading } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function DashboardAdminTeamManagementPage() {
  const users = await prisma.user.findMany({
    where: {
      roles: {
        has: Role.PLAYER || Role.COACH,
      },
    },
    omit: {
      password: true,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>Team Management</PageHeaderHeading>

      <DataTable
        data={users}
        columns={columns}
        filterFields={filterFields}
        initialState={{
          columnPinning: { right: ["actions"] },
          sorting: [{ id: "username", desc: true }],
        }}
      />
    </div>
  );
}
