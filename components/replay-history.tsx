"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Check, Copy, Inbox, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import ReplayEditDialog from "@/components/replay-edit-dialog";
import ReplayFilters from "@/components/replay-filters";
import { Profile } from "@/utils/profile";
import { cn } from "@/lib/utils";
import DeleteReplayButton from "./replay-delete-button";
import { Database } from "@/lib/database.types";

type Replay = Database["public"]["Tables"]["replays"]["Row"];

interface ReplayHistoryProps {
  replays: Replay[];
  maps: { id: string; name: string }[];
  match_modes: { id: string; name: string }[];
  profile: Profile;
}

/**
 * Determine the color styling based on the replay result.
 */
function getResultColor(result: Replay["result"]) {
  switch (result) {
    case "Victory":
      return "bg-green-500/20 text-green-700 dark:text-green-300";
    case "Defeat":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    case "Draw":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
  }
}

/**
 * Renders the badges for a given replay.
 */
function renderBadges(replay: Replay) {
  return (
    <>
      <Badge
        variant="outline"
        className="bg-purple-500/20 text-purple-700 dark:text-purple-300 whitespace-nowrap"
      >
        {replay.map_name}
      </Badge>
      <Badge variant="outline" className="whitespace-nowrap">
        {replay.map_mode}
      </Badge>
      <Badge
        variant="outline"
        className={cn(getResultColor(replay.result), "whitespace-nowrap")}
      >
        {replay.result}
      </Badge>
      {replay.is_reviewed && (
        <Badge variant="secondary" className="whitespace-nowrap">
          Reviewed
        </Badge>
      )}
    </>
  );
}

/**
 * Renders the action buttons (copy, edit, delete) for a given replay.
 * Any changes here affect both small and large screen layouts where these buttons are used.
 */
function renderActionButtons(
  replay: Replay,
  copiedCode: string | null,
  handleCopy: (code: string) => void,
  setEditingReplay: (replay: Replay) => void,
  canEditOrDelete: boolean
) {
  return (
    <>
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
      {canEditOrDelete && (
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
            showButton={canEditOrDelete}
          />
        </>
      )}
    </>
  );
}

/**
 * Groups replays by date and time for display.
 */
function groupReplaysByDateAndTime(replays: Replay[]) {
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

  replayData.sort((a, b) => b.timestamp - a.timestamp);

  const dateMap = new Map<string, typeof replayData>();

  replayData.forEach(({ dateKey, ...rest }) => {
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push({ dateKey, ...rest });
  });

  const groupedData = Array.from(dateMap.entries()).map(([date, replays]) => {
    const timeMap = new Map<string, Replay[]>();

    replays.forEach(({ timeKey, replay }) => {
      if (!timeMap.has(timeKey)) {
        timeMap.set(timeKey, []);
      }
      timeMap.get(timeKey)!.push(replay);
    });

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
  match_modes,
  profile,
}: ReplayHistoryProps) {
  const [editingReplay, setEditingReplay] = useState<Replay | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filteredReplays, setFilteredReplays] = useState<Replay[]>(replays);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUpdate = async (replayId: string, updates: Partial<Replay>) => {
    try {
      const { error } = await supabase
        .from("replays")
        .update(updates)
        .eq("id", replayId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Replay code updated successfully",
      });
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

  const groupedReplays = groupReplaysByDateAndTime(filteredReplays);

  return (
    <div className="flex flex-col gap-4">
      <ReplayFilters
        replays={replays}
        maps={maps}
        match_modes={match_modes}
        onFilterChange={setFilteredReplays}
      />

      {groupedReplays.length === 0 ? (
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
            {groupedReplays.map(({ date, times }) => (
              <div
                key={date}
                className="border-b border-border/40 last:border-0"
              >
                <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur p-4 border-b border-border/40">
                  <h3 className="text-sm font-medium">{date}</h3>
                </div>
                {times.map(([time, replaysAtTime]) => (
                  <div key={time} className="divide-y divide-border/40">
                    <div className="bg-muted/80 backdrop-blur p-4 border-b border-border/40">
                      <h4 className="text-sm font-semibold">{time}</h4>
                    </div>
                    {replaysAtTime.map((replay) => {
                      const canEditOrDelete =
                        profile.app_role === "admin" ||
                        profile.id === replay.uploaded_by;

                      return (
                        <div
                          key={replay.id}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                            <div className="flex items-center gap-4">
                              <code className="text-lg font-mono">
                                {replay.code}
                              </code>

                              {/* Badges for large screens */}
                              <div className="hidden sm:flex flex-wrap items-center gap-2">
                                {renderBadges(replay)}
                              </div>

                              {/* Action buttons for small screens */}
                              <div className="sm:hidden flex gap-1">
                                {renderActionButtons(
                                  replay,
                                  copiedCode,
                                  handleCopy,
                                  setEditingReplay,
                                  canEditOrDelete
                                )}
                              </div>
                            </div>

                            {/* Badges for small screens */}
                            <div className="sm:hidden flex flex-wrap items-center gap-2 mt-2">
                              {renderBadges(replay)}
                            </div>

                            {/* Action buttons for large screens */}
                            <div className="hidden sm:flex gap-1">
                              {renderActionButtons(
                                replay,
                                copiedCode,
                                handleCopy,
                                setEditingReplay,
                                canEditOrDelete
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
                      );
                    })}
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
