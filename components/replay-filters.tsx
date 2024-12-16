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
import { Database } from "@/lib/database.types";

type Replay = Database["public"]["Tables"]["replays"]["Row"];

interface ReplayFiltersProps {
  replays: Replay[];
  onFilterChange: (filteredReplays: Replay[]) => void;
}

export default function ReplayFilters({
  replays,
  onFilterChange,
}: ReplayFiltersProps) {
  const [selectedMap, setSelectedMap] = React.useState<string>("");
  const [selectedMode, setSelectedMode] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  const gameModes = React.useMemo(() => {
    return _.uniqBy(replays, "map_mode").map((replay) => replay.map_mode);
  }, [replays]);

  const maps = React.useMemo(() => {
    return _.uniqBy(replays, "map_name").map((replay) => ({
      id: replay.map_name,
      name: replay.map_name,
    }));
  }, [replays]);

  const filterReplays = React.useCallback(() => {
    let filtered = [...replays];

    if (selectedMap) {
      filtered = filtered.filter((replay) => replay.map_name === selectedMap);
    }

    if (selectedMode) {
      filtered = filtered.filter((replay) => replay.map_mode === selectedMode);
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
