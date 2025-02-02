import type { Role, Specialty } from "@prisma/client";
import type { Column } from "@tanstack/react-table";
import {
  AxeIcon,
  CircleIcon,
  CircleUserIcon,
  CrownIcon,
  GraduationCapIcon,
  PickaxeIcon,
  ShieldHalfIcon,
  ShieldPlusIcon,
  StethoscopeIcon,
  SwordsIcon,
  SyringeIcon,
} from "lucide-react";

export function sanitizeString(string: string) {
  return string
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getSpecialtyIcon(specialty: Specialty) {
  const specialtyIcons = {
    MAIN_TANK: ShieldHalfIcon,
    OFF_TANK: ShieldPlusIcon,
    FLEX_DPS: PickaxeIcon,
    HITSCAN_DPS: AxeIcon,
    MAIN_HEAL: SyringeIcon,
    FLEX_HEAL: StethoscopeIcon,
  };

  return specialtyIcons[specialty] || CircleIcon;
}

export function getRoleIcon(role: Role) {
  const roleIcons = {
    USER: CircleUserIcon,
    PLAYER: SwordsIcon,
    COACH: GraduationCapIcon,
    ADMIN: CrownIcon,
  };

  return roleIcons[role] || CircleIcon;
}

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px hsl(var(--border)) inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px hsl(var(--border)) inset"
          : undefined
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    background: isPinned ? "hsl(var(--background))" : "hsl(var(--background))",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}
