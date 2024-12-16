import { useCallback, useEffect, useState } from "react";
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
  map_names: { id: string; name: string }[];
  map_modes: { id: string; name: string }[];
  onFilterChange: (filteredReplays: Replay[]) => void;
}

function renderClearFiltersButton(clearFilters: () => void, className: string) {
  return (
    <Button
      variant="ghost"
      onClick={clearFilters}
      className={className}
      aria-label="Clear all filters"
    >
      <X className="h-4 w-4" />
      Clear filters
    </Button>
  );
}

export default function ReplayFilters({
  replays,
  map_names,
  map_modes,
  onFilterChange,
}: ReplayFiltersProps) {
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const filterReplays = useCallback(() => {
    let filtered = [...replays];

    if (selectedMap && selectedMap !== "none") {
      filtered = filtered.filter((replay) => replay.map_name === selectedMap);
    }

    if (selectedMode && selectedMode !== "none") {
      filtered = filtered.filter((replay) => replay.map_mode === selectedMode);
    }

    if (selectedStatus && selectedStatus !== "none") {
      if (selectedStatus === "reviewed") {
        filtered = filtered.filter((replay) => replay.is_reviewed);
      } else if (selectedStatus === "unreviewed") {
        filtered = filtered.filter((replay) => !replay.is_reviewed);
      }
    }

    onFilterChange(filtered);
  }, [replays, selectedMap, selectedMode, selectedStatus, onFilterChange]);

  useEffect(() => {
    filterReplays();
  }, [selectedMap, selectedMode, selectedStatus, filterReplays]);

  const clearFilters = () => {
    setSelectedMap("none");
    setSelectedMode("none");
    setSelectedStatus("none");
  };

  const hasActiveFilters =
    (selectedMap && selectedMap !== "none") ||
    (selectedMode && selectedMode !== "none") ||
    (selectedStatus && selectedStatus !== "none");

  return (
    <fieldset className="flex flex-col gap-4 py-4 md:flex-row md:flex-wrap lg:justify-end">
      <legend className="sr-only">Filter replay codes</legend>

      {hasActiveFilters &&
        renderClearFiltersButton(clearFilters, "gap-2 hidden lg:flex")}

      {/* Map Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="map-filter" className="sr-only">
          Map filter
        </label>
        <Select value={selectedMap || "none"} onValueChange={setSelectedMap}>
          <SelectTrigger
            id="map-filter"
            className="md:w-[200px]"
            aria-label="Filter by map"
          >
            <SelectValue placeholder="Select map" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none" className="cursor-pointer">
                None
              </SelectItem>
              {map_names.map((map) => (
                <SelectItem
                  key={map.id}
                  value={map.id}
                  className="cursor-pointer"
                >
                  {map.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Mode Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="mode-filter" className="sr-only">
          Game mode filter
        </label>
        <Select value={selectedMode || "none"} onValueChange={setSelectedMode}>
          <SelectTrigger
            id="mode-filter"
            className="md:w-[200px]"
            aria-label="Filter by game mode"
          >
            <SelectValue placeholder="Select game mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none" className="cursor-pointer">
                None
              </SelectItem>
              {map_modes.map((mode) => (
                <SelectItem
                  key={mode.id}
                  value={mode.name}
                  className="cursor-pointer"
                >
                  {mode.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Review Status Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="review-status-filter" className="sr-only">
          Review status filter
        </label>
        <Select
          value={selectedStatus || "none"}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger
            id="review-status-filter"
            className="md:w-[200px]"
            aria-label="Filter by review status"
          >
            <SelectValue placeholder="Review status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none" className="cursor-pointer">
                None
              </SelectItem>
              <SelectItem value="reviewed" className="cursor-pointer">
                Reviewed
              </SelectItem>
              <SelectItem value="unreviewed" className="cursor-pointer">
                Not Reviewed
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters &&
        renderClearFiltersButton(clearFilters, "gap-2 lg:hidden")}
    </fieldset>
  );
}
