import { Metadata } from "next";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Announcement } from "@/components/announcement";

export const metadata: Metadata = {
  title: "Calendar",
  description: "View upcoming events",
};

export default function CalendarPage() {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>View upcoming events</PageHeaderHeading>
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
