"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Database } from "@/lib/database.types";
import { ComboBoxResponsive } from "./combo-box";

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
  const [selectedMap, setSelectedMap] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedMode, setSelectedMode] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const filterReplays = useCallback(() => {
    let filtered = [...replays];

    if (selectedMap && selectedMap.value !== "none") {
      filtered = filtered.filter(
        (replay) => replay.map_name === selectedMap.value
      );
    }

    if (selectedMode && selectedMode.value !== "none") {
      filtered = filtered.filter(
        (replay) => replay.map_mode === selectedMode.value
      );
    }

    if (selectedStatus && selectedStatus.value !== "none") {
      if (selectedStatus.value === "reviewed") {
        filtered = filtered.filter((replay) => replay.is_reviewed);
      } else if (selectedStatus.value === "unreviewed") {
        filtered = filtered.filter((replay) => !replay.is_reviewed);
      }
    }

    onFilterChange(filtered);
  }, [replays, selectedMap, selectedMode, selectedStatus, onFilterChange]);

  useEffect(() => {
    filterReplays();
  }, [selectedMap, selectedMode, selectedStatus, filterReplays]);

  const clearFilters = () => {
    setSelectedMap(null);
    setSelectedMode(null);
    setSelectedStatus(null);
  };

  const hasActiveFilters =
    (selectedMap && selectedMap.value !== "none") ||
    (selectedMode && selectedMode.value !== "none") ||
    (selectedStatus && selectedStatus.value !== "none");

  const maps = map_names.map((map) => ({ value: map.id, label: map.name }));
  maps.unshift({ value: "none", label: "None" });

  const modes = map_modes.map((mode) => ({ value: mode.id, label: mode.name }));
  modes.unshift({ value: "none", label: "None" });

  const statuses = [
    { value: "none", label: "None" },
    { value: "reviewed", label: "Reviewed" },
    { value: "unreviewed", label: "Not Reviewed" },
  ];

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
        <ComboBoxResponsive
          values={maps}
          selectedValue={selectedMap}
          setSelectedValue={setSelectedMap}
          placeholder="Select map"
          buttonLabel="Filter by map"
        />
      </div>

      {/* Mode Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="mode-filter" className="sr-only">
          Game mode filter
        </label>
        <ComboBoxResponsive
          values={modes}
          selectedValue={selectedMode}
          setSelectedValue={setSelectedMode}
          placeholder="Select game mode"
          buttonLabel="Filter by mode"
        />
      </div>

      {/* Review Status Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="review-status-filter" className="sr-only">
          Review status filter
        </label>
        <ComboBoxResponsive
          values={statuses}
          selectedValue={selectedStatus}
          setSelectedValue={setSelectedStatus}
          placeholder="Review status"
          buttonLabel="Filter by status"
        />
      </div>

      {hasActiveFilters &&
        renderClearFiltersButton(clearFilters, "gap-2 lg:hidden")}
    </fieldset>
  );
}
