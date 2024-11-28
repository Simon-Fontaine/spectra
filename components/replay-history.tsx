"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Check, Copy, Inbox, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import ReplayEditDialog from "@/components/replay-edit-dialog";
import { Profile } from "@/utils/profile";
import { cn } from "@/lib/utils";
import DeleteReplayButton from "./replay-delete-button";

interface GameMode {
  name: string;
}

interface MapDetails {
  id: string;
  name: string;
  game_mode: GameMode;
}

interface ReplayCode {
  id: string;
  code: string;
  map_id: string;
  map: MapDetails;
  result: "Victory" | "Defeat" | "Draw";
  notes: string | null;
  is_reviewed: boolean;
  uploaded_image_url: string | null;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
}

interface ReplayHistoryProps {
  replays: ReplayCode[];
  maps: MapDetails[];
  profile: Profile;
}

function groupReplaysByDateAndTime(replays: ReplayCode[]) {
  // Map replays to include Date objects
  const replayData = replays.map((replay) => {
    const fullDate = new Date(replay.created_at);
    return {
      dateKey: fullDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      timeKey: fullDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: fullDate.getTime(),
      fullDate,
      replay,
    };
  });

  // Sort replays by timestamp descending
  replayData.sort((a, b) => b.timestamp - a.timestamp);

  // Group by date
  const dateMap = new Map<string, typeof replayData>();

  replayData.forEach(({ dateKey, ...rest }) => {
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push({ dateKey, ...rest });
  });

  // Prepare the grouped data
  const groupedData = Array.from(dateMap.entries()).map(([date, replays]) => {
    // Group by time
    const timeMap = new Map<string, ReplayCode[]>();

    replays.forEach(({ timeKey, replay }) => {
      if (!timeMap.has(timeKey)) {
        timeMap.set(timeKey, []);
      }
      timeMap.get(timeKey)!.push(replay);
    });

    // Sort times in descending order
    const times = Array.from(timeMap.entries()).sort(([timeA], [timeB]) => {
      const dateTimeA = new Date(`${date} ${timeA}`).getTime();
      const dateTimeB = new Date(`${date} ${timeB}`).getTime();
      return dateTimeB - dateTimeA;
    });

    return {
      date,
      times,
    };
  });

  // Sort dates in descending order
  groupedData.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return groupedData;
}

export default function ReplayHistory({
  replays,
  maps,
  profile,
}: ReplayHistoryProps) {
  const [editingReplay, setEditingReplay] = useState<ReplayCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUpdate = async (
    replayId: string,
    updates: Partial<ReplayCode>
  ) => {
    try {
      const { error } = await supabase
        .from("replay_codes")
        .update(updates)
        .eq("id", replayId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Replay code updated successfully",
      });

      // Refresh the page to get the updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating replay code:", error);
      toast({
        title: "Error",
        description: "Failed to update replay code",
        variant: "destructive",
      });
    }
  };

  const getResultColor = (result: ReplayCode["result"]) => {
    switch (result) {
      case "Victory":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "Defeat":
        return "bg-red-500/20 text-red-700 dark:text-red-300";
      case "Draw":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {replays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Inbox className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No replay codes found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a screenshot to add your first replay code
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-lg border border-border/40 bg-background shadow">
          <div className="h-full overflow-y-auto">
            {groupReplaysByDateAndTime(replays).map(({ date, times }) => (
              <div
                key={date}
                className="border-b border-border/40 last:border-0"
              >
                <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur p-4 border-b border-border/40">
                  <h3 className="text-sm font-medium">{date}</h3>
                </div>
                {times.map(([time, replays]) => (
                  <div key={time} className="divide-y divide-border/40">
                    <div className="bg-muted/80 backdrop-blur p-4 border-b border-border/40">
                      <h4 className="text-sm font-semibold">{time}</h4>
                    </div>
                    {replays.map((replay) => (
                      <div
                        key={replay.id}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                          {/* Left Section */}
                          <div className="flex items-center gap-4">
                            <code className="text-lg font-mono">
                              {replay.code}
                            </code>
                            {/* Badges for Large Screens */}
                            <div className="hidden sm:flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-purple-500/20 text-purple-700 dark:text-purple-300 whitespace-nowrap"
                              >
                                {replay.map.name}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="whitespace-nowrap"
                              >
                                {replay.map.game_mode.name}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  getResultColor(replay.result),
                                  "whitespace-nowrap"
                                )}
                              >
                                {replay.result}
                              </Badge>
                              {replay.is_reviewed && (
                                <Badge
                                  variant="secondary"
                                  className="whitespace-nowrap"
                                >
                                  Reviewed
                                </Badge>
                              )}
                            </div>
                            {/* Buttons for Small Screens */}
                            <div className="sm:hidden flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(replay.code)}
                              >
                                {copiedCode === replay.code ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              {(profile.app_role === "admin" ||
                                profile.id === replay.uploaded_by) && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingReplay(replay)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <DeleteReplayButton
                                    replayId={replay.id}
                                    showButton={profile.app_role === "admin"}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          {/* Badges for Small Screens */}
                          <div className="sm:hidden flex flex-wrap items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-500/20 text-purple-700 dark:text-purple-300 whitespace-nowrap"
                            >
                              {replay.map.name}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              {replay.map.game_mode.name}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                getResultColor(replay.result),
                                "whitespace-nowrap"
                              )}
                            >
                              {replay.result}
                            </Badge>
                            {replay.is_reviewed && (
                              <Badge
                                variant="secondary"
                                className="whitespace-nowrap"
                              >
                                Reviewed
                              </Badge>
                            )}
                          </div>
                          {/* Buttons for Large Screens */}
                          <div className="hidden sm:flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(replay.code)}
                            >
                              {copiedCode === replay.code ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            {(profile.app_role === "admin" ||
                              profile.id === replay.uploaded_by) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingReplay(replay)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <DeleteReplayButton
                                  replayId={replay.id}
                                  showButton={profile.app_role === "admin"}
                                />
                              </>
                            )}
                          </div>
                        </div>
                        {/* Notes and Uploaded Image */}
                        {(replay.notes || replay.uploaded_image_url) && (
                          <div className="mt-2 flex flex-col gap-2">
                            {replay.notes && (
                              <p className="text-sm text-muted-foreground">
                                {replay.notes}
                              </p>
                            )}
                            {replay.uploaded_image_url && (
                              <a
                                href={replay.uploaded_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1 text-purple-700 dark:text-purple-300"
                              >
                                View Original Screenshot
                                <Icons.external className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {editingReplay && (
        <ReplayEditDialog
          replay={editingReplay}
          maps={maps}
          open={!!editingReplay}
          onOpenChange={(open) => !open && setEditingReplay(null)}
          onSave={(updates) => handleUpdate(editingReplay.id, updates)}
        />
      )}
    </div>
  );
}
