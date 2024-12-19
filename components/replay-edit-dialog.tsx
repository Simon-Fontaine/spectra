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
import { Input } from "@/components/ui/input";

type Replay = Database["public"]["Tables"]["replays"]["Row"];

interface EditDialogProps {
  replay: Replay;
  map_names: { id: string; name: string }[];
  map_modes: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedReplay: Partial<Replay>) => Promise<void>;
}

export default function ReplayEditDialog({
  replay,
  map_names,
  map_modes,
  open,
  onOpenChange,
  onSave,
}: EditDialogProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    map_name: replay.map_name,
    map_mode: replay.map_mode,
    result: replay.result,
    score: replay.score || "",
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
          {/* Map Selection */}
          <div>
            <label htmlFor="map-select" className="sr-only">
              Map
            </label>
            <Select
              value={formData.map_name}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, map_name: value }))
              }
            >
              <SelectTrigger id="map-select">
                <SelectValue placeholder="Select map">
                  {formData.map_name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {map_names.map((map) => (
                  <SelectItem
                    className="cursor-pointer hover:bg-muted"
                    key={map.id}
                    value={map.name}
                  >
                    {map.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Match Mode Selection */}
          <div>
            <label htmlFor="mode-select" className="sr-only">
              Match Mode
            </label>
            <Select
              value={formData.map_mode}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, map_mode: value }))
              }
            >
              <SelectTrigger id="mode-select">
                <SelectValue placeholder="Select mode">
                  {formData.map_mode}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {map_modes.map((mode) => (
                  <SelectItem
                    className="cursor-pointer hover:bg-muted"
                    key={mode.id}
                    value={mode.name}
                  >
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result Selection */}
          <div>
            <label htmlFor="result-select" className="sr-only">
              Result
            </label>
            <Select
              value={formData.result}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  result: value as "Victory" | "Defeat" | "Draw",
                }))
              }
            >
              <SelectTrigger id="result-select">
                <SelectValue placeholder="Select result">
                  {formData.result}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="cursor-pointer hover:bg-muted"
                  value="Victory"
                >
                  Victory
                </SelectItem>
                <SelectItem
                  className="cursor-pointer hover:bg-muted"
                  value="Defeat"
                >
                  Defeat
                </SelectItem>
                <SelectItem
                  className="cursor-pointer hover:bg-muted"
                  value="Draw"
                >
                  Draw
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Score Input */}
          <div>
            <label htmlFor="score-input" className="sr-only">
              Score (e.g. "2-1")
            </label>
            <Input
              id="score-input"
              placeholder="Score (e.g. 2-1)"
              value={formData.score}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, score: e.target.value }))
              }
            />
          </div>

          {/* Notes Textarea */}
          <div>
            <label htmlFor="notes-textarea" className="sr-only">
              Notes
            </label>
            <Textarea
              id="notes-textarea"
              placeholder="Add notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          {/* Reviewed Checkbox */}
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
            <label htmlFor="is_reviewed" className="text-sm">
              Mark as reviewed
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="mt-2 sm:mt-0"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
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
