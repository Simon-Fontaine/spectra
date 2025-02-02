import { Announcement } from "@/components/announcement";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Read the latest news",
};

export default function NewsPage() {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Read the latest news</PageHeaderHeading>
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
