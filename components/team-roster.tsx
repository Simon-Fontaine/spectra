import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { User2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Role, Specialty } from "@prisma/client";

interface RosterMember {
  specialty: Specialty;
  id: string;
  displayName: string | null;
  username: string;
  roles: Role[];
  avatarUrl: string | null;
  battletag: string | null;
  isSubstitute: boolean;
}

const specialtyOrder = {
  MAIN_TANK: 1,
  OFF_TANK: 2,
  HITSCAN_DPS: 3,
  FLEX_DPS: 4,
  MAIN_HEAL: 5,
  FLEX_HEAL: 6,
};

const specialtyLabels = {
  MAIN_TANK: "Main Tank",
  OFF_TANK: "Off Tank",
  HITSCAN_DPS: "Hitscan DPS",
  FLEX_DPS: "Flex DPS",
  MAIN_HEAL: "Main Support",
  FLEX_HEAL: "Flex Support",
};

interface RosterProps {
  members: RosterMember[];
}

function getSpecialtyColor(specialty: Specialty) {
  switch (specialty) {
    case "MAIN_TANK":
    case "OFF_TANK":
      return "bg-purple-500/20 text-purple-700 dark:text-purple-300";
    case "FLEX_DPS":
    case "HITSCAN_DPS":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    case "MAIN_HEAL":
    case "FLEX_HEAL":
      return "bg-green-500/20 text-green-700 dark:text-green-300";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
  }
}

export function TeamRoster({ members }: RosterProps) {
  const players = members.filter(
    (member) =>
      member.roles.includes(Role.PLAYER) || member.roles.includes(Role.COACH)
  );

  // Group players by specialty
  const groupedPlayers = useMemo(() => {
    const grouped = players.reduce((acc, player) => {
      if (!acc[player.specialty]) {
        acc[player.specialty] = [];
      }
      acc[player.specialty].push(player);
      return acc;
    }, {} as Record<Specialty, RosterMember[]>);

    // Sort specialties by predefined order
    return Object.entries(grouped).sort(
      ([specialtyA], [specialtyB]) =>
        specialtyOrder[specialtyA as keyof typeof specialtyOrder] -
        specialtyOrder[specialtyB as keyof typeof specialtyOrder]
    );
  }, [players]);

  if (!players.length) {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groupedPlayers.map(([specialty, players]) => (
        <Card key={specialty} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  getSpecialtyColor(specialty as RosterMember["specialty"])
                )}
              >
                {specialtyLabels[specialty as keyof typeof specialtyLabels]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({players.length})
              </span>
            </CardTitle>
            <CardDescription>
              {specialty.includes("TANK")
                ? "Tank Line"
                : specialty.includes("DPS")
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
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={player.avatarUrl || undefined} />
                    <AvatarFallback className="rounded-lg">
                      {player.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {player.displayName || player.username}
                      </p>
                      {player.roles.includes(Role.COACH) && (
                        <Badge variant="secondary" className="text-xs">
                          Coach
                        </Badge>
                      )}
                      {player.roles.includes(Role.ADMIN) && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    {player.isSubstitute && (
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
