import React from "react";
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

interface ReplayFiltersProps {
  replays: ReplayCode[];
  maps: MapDetails[];
  onFilterChange: (filteredReplays: ReplayCode[]) => void;
}

export default function ReplayFilters({
  replays,
  maps,
  onFilterChange,
}: ReplayFiltersProps) {
  const [selectedMap, setSelectedMap] = React.useState<string>("");
  const [selectedMode, setSelectedMode] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  const gameModes = React.useMemo(() => {
    return _.uniqBy(maps, "game_mode.name").map((map) => map.game_mode.name);
  }, [maps]);

  const filterReplays = React.useCallback(() => {
    let filtered = [...replays];

    if (selectedMap) {
      filtered = filtered.filter((replay) => replay.map.id === selectedMap);
    }

    if (selectedMode) {
      filtered = filtered.filter(
        (replay) => replay.map.game_mode.name === selectedMode
      );
    }

    if (selectedStatus) {
      if (selectedStatus === "reviewed") {
        filtered = filtered.filter((replay) => replay.is_reviewed);
      } else if (selectedStatus === "unreviewed") {
        filtered = filtered.filter((replay) => !replay.is_reviewed);
      }
    }

    onFilterChange(filtered);
  }, [replays, selectedMap, selectedMode, selectedStatus, onFilterChange]);

  React.useEffect(() => {
    filterReplays();
  }, [selectedMap, selectedMode, selectedStatus, filterReplays]);

  const clearFilters = () => {
    setSelectedMap("");
    setSelectedMode("");
    setSelectedStatus("");
  };

  const hasActiveFilters = selectedMap || selectedMode || selectedStatus;

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap items-center gap-4 py-4 lg:justify-end">
      <Select value={selectedMap} onValueChange={setSelectedMap}>
        <SelectTrigger className="md:w-[200px]">
          <SelectValue placeholder="Select map" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {maps.map((map) => (
              <SelectItem key={map.id} value={map.id}>
                {map.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={selectedMode} onValueChange={setSelectedMode}>
        <SelectTrigger className="md:w-[200px]">
          <SelectValue placeholder="Select game mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {gameModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="md:w-[200px]">
          <SelectValue placeholder="Review status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="unreviewed">Not Reviewed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
