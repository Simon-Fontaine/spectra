import { Announcement } from "@/components/announcement";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roster",
  description: "Meet the team",
};

export default function RosterPage() {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Meet the team</PageHeaderHeading>
        <PageHeaderDescription>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
          porro? Quis deleniti dicta placeat eaque repellat labore accusantium
          sunt, veritatis fuga vel minima minus nesciunt ex impedit sit, libero
          tempora.
        </PageHeaderDescription>
      </PageHeader>
    </>
  );
}
