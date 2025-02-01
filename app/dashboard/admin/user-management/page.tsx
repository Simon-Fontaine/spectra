import {
  columns,
  filterFields,
} from "@/app/dashboard/admin/user-management/_components/columns";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeaderHeading } from "@/components/page-header";
import prisma from "@/lib/prisma";

export default async function DashboardAdminUserManagementPage() {
  const users = await prisma.user.findMany({});

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>User Management</PageHeaderHeading>

      <DataTable
        data={users}
        columns={columns}
        filterFields={filterFields}
        initialState={{
          columnPinning: { right: ["actions"] },
          sorting: [{ id: "createdAt", desc: true }],
        }}
      />
    </div>
  );
}
