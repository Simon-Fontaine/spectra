import { Separator } from "@/components/ui/separator";
import { ArrowRight, Video } from "lucide-react";
import Link from "next/link";

export function Announcement() {
  return (
    <Link
      href="https://www.youtube.com"
      target="_blank"
      className="group mb-2 inline-flex items-center px-0.5 text-sm font-medium"
    >
      <Video className="h-4 w-4" />{" "}
      <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span className="underline-offset-4 group-hover:underline">
        New roster reveal video!
      </span>
      <ArrowRight className="group ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}