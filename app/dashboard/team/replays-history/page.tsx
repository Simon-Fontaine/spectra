"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Check, Copy, Inbox, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";

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

interface EditDialogProps {
  replay: ReplayCode;
  maps: MapDetails[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedReplay: Partial<ReplayCode>) => Promise<void>;
}

function groupReplaysByDate(replays: ReplayCode[]) {
  const groups = replays.reduce(
    (acc, replay) => {
      const date = new Date(replay.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(replay);
      return acc;
    },
    {} as Record<string, ReplayCode[]>
  );

  return Object.entries(groups).sort((a, b) => {
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });
}

function EditDialog({
  replay,
  maps,
  open,
  onOpenChange,
  onSave,
}: EditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    map_id: replay.map_id,
    result: replay.result,
    notes: replay.notes || "",
    is_reviewed: replay.is_reviewed,
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Replay Code</DialogTitle>
          <DialogDescription>
            Update the details for replay code {replay.code}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Select
              value={formData.map_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, map_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select map">
                  {maps.find((m) => m.id === formData.map_id)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {maps.map((map) => (
                  <SelectItem key={map.id} value={map.id}>
                    {map.name} ({map.game_mode.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.result}
              onValueChange={(value: ReplayCode["result"]) =>
                setFormData((prev) => ({ ...prev, result: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Victory">Victory</SelectItem>
                <SelectItem value="Defeat">Defeat</SelectItem>
                <SelectItem value="Draw">Draw</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Add notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_reviewed"
              className="h-4 w-4"
              checked={formData.is_reviewed}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_reviewed: e.target.checked,
                }))
              }
            />
            <label htmlFor="is_reviewed">Mark as reviewed</label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ReplayHistoryPage() {
  const [replayCodes, setReplayCodes] = useState<ReplayCode[]>([]);
  const [maps, setMaps] = useState<MapDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReplay, setEditingReplay] = useState<ReplayCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const fetchMaps = async () => {
    const { data, error } = await supabase
      .from("maps")
      .select(
        `
        id,
        name,
        game_mode:game_modes!game_mode_id(name)
      `
      )
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching maps:", error);
      return;
    }

    // Type assertion to ensure the data matches our interface
    const mapsWithGameModes = data.map((map) => ({
      id: map.id,
      name: map.name,
      game_mode: {
        name: (map.game_mode as any).name,
      },
    })) as MapDetails[];

    setMaps(mapsWithGameModes);
  };

  const fetchReplayCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("replay_codes")
        .select(
          `
          *,
          map:maps!map_id(
            id,
            name,
            game_mode:game_modes!game_mode_id(name)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform and type the data
      const transformedData = data.map((replay) => ({
        ...replay,
        map: {
          id: (replay.map as any).id,
          name: (replay.map as any).name,
          game_mode: {
            name: (replay.map as any).game_mode.name,
          },
        },
      })) as ReplayCode[];

      setReplayCodes(transformedData);
    } catch (error) {
      console.error("Error fetching replay codes:", error);
      toast({
        title: "Error",
        description: "Failed to load replay codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchMaps(), fetchReplayCodes()]);
  }, []);

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

      // Refresh the list
      fetchReplayCodes();
    } catch (error) {
      console.error("Error updating replay code:", error);
      toast({
        title: "Error",
        description: "Failed to update replay code",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (replayId: string) => {
    if (!confirm("Are you sure you want to delete this replay code?")) return;

    try {
      const { error } = await supabase
        .from("replay_codes")
        .delete()
        .eq("id", replayId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Replay code deleted successfully",
      });

      // Refresh the list
      fetchReplayCodes();
    } catch (error) {
      console.error("Error deleting replay code:", error);
      toast({
        title: "Error",
        description: "Failed to delete replay code",
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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Replay History</PageHeaderHeading>
        <PageHeaderDescription>
          View and manage your saved replay codes
        </PageHeaderDescription>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : replayCodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Inbox className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No replay codes found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Go to the replay extraction page to add your first replay code
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/team/replays")}
          >
            Extract Replay Codes
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-lg border border-border/40 bg-background shadow">
          <div className="h-full overflow-y-auto">
            {groupReplaysByDate(replayCodes).map(([date, replays]) => (
              <div
                key={date}
                className="border-b border-border/40 last:border-0"
              >
                <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur p-4 border-b border-border/40">
                  <h3 className="text-sm font-medium">{date}</h3>
                </div>
                <div className="divide-y divide-border/40">
                  {replays.map((replay) => (
                    <div
                      key={replay.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <code className="text-lg font-mono">
                            {replay.code}
                          </code>
                          <div className="flex items-center gap-2">
                            <Badge>{replay.map.name}</Badge>
                            <Badge variant="outline">
                              {replay.map.game_mode.name}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getResultColor(replay.result)}
                            >
                              {replay.result}
                            </Badge>
                            {replay.is_reviewed && (
                              <Badge variant="secondary">Reviewed</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingReplay(replay)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(replay.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {editingReplay && (
        <EditDialog
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
