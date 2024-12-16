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
import { Database } from "@/lib/database.types";

type Replay = Database["public"]["Tables"]["replays"]["Row"];

interface EditDialogProps {
  replay: Replay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedReplay: Partial<Replay>) => Promise<void>;
}

export default function ReplayEditDialog({
  replay,
  open,
  onOpenChange,
  onSave,
}: EditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    map_id: replay.map_name,
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
              onValueChange={(value: Replay["map_name"]) =>
                setFormData((prev) => ({ ...prev, map_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select map">
                  {formData.map_id}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Map 1">Map 1</SelectItem>
                <SelectItem value="Map 2">Map 2</SelectItem>
                <SelectItem value="Map 3">Map 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.result}
              onValueChange={(value: Replay["result"]) =>
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
