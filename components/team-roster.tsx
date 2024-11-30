import React from "react";
import { User2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RosterMember {
  id: string;
  username: string;
  avatar_url: string | null;
  ow_role:
    | "main_tank"
    | "off_tank"
    | "flex_dps"
    | "hitscan_dps"
    | "main_heal"
    | "flex_heal";
  is_substitute: boolean;
  app_role: "user" | "admin";
}

const roleOrder = {
  main_tank: 1,
  off_tank: 2,
  hitscan_dps: 3,
  flex_dps: 4,
  main_heal: 5,
  flex_heal: 6,
};

const roleLabels = {
  main_tank: "Main Tank",
  off_tank: "Off Tank",
  flex_dps: "Flex DPS",
  hitscan_dps: "Hitscan DPS",
  main_heal: "Main Support",
  flex_heal: "Flex Support",
};

interface RosterProps {
  members: RosterMember[];
}

function getRoleColor(role: RosterMember["ow_role"]) {
  switch (role) {
    case "main_tank":
    case "off_tank":
      return "bg-purple-500/20 text-purple-700 dark:text-purple-300";
    case "flex_dps":
    case "hitscan_dps":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    case "main_heal":
    case "flex_heal":
      return "bg-green-500/20 text-green-700 dark:text-green-300";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
  }
}

export function TeamRoster({ members }: RosterProps) {
  if (!members.length) {
    return (
      <Card className="flex h-[200px] items-center justify-center text-center">
        <CardContent>
          <User2Icon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            No team members found
          </p>
          <p className="text-sm text-muted-foreground/80">
            Team members will appear here once they are added.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group members by role
  const groupedMembers = React.useMemo(() => {
    const grouped = members.reduce(
      (acc, member) => {
        if (!acc[member.ow_role]) {
          acc[member.ow_role] = [];
        }
        acc[member.ow_role].push(member);
        return acc;
      },
      {} as Record<RosterMember["ow_role"], RosterMember[]>
    );

    // Sort roles by predefined order
    return Object.entries(grouped).sort(
      ([roleA], [roleB]) =>
        roleOrder[roleA as keyof typeof roleOrder] -
        roleOrder[roleB as keyof typeof roleOrder]
    );
  }, [members]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groupedMembers.map(([role, players]) => (
        <Card key={role} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  getRoleColor(role as RosterMember["ow_role"])
                )}
              >
                {roleLabels[role as keyof typeof roleLabels]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({players.length})
              </span>
            </CardTitle>
            <CardDescription>
              {role === "main_tank" || role === "off_tank"
                ? "Tank Line"
                : role.includes("dps")
                  ? "DPS Line"
                  : "Support Line"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.avatar_url || undefined} />
                    <AvatarFallback>
                      <User2Icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {player.username}
                      </p>
                      {player.app_role === "admin" && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    {player.is_substitute && (
                      <p className="text-sm text-muted-foreground">
                        Substitute Player
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
