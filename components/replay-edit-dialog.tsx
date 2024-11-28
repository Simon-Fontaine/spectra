"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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

export default function ReplayEditDialog({
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
                <SelectValue placeholder="Select result">
                  {formData.result}
                </SelectValue>
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
