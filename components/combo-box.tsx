"use client";

import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Value = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  values: Value[];
  selectedValue: Value | null;
  setSelectedValue: (value: Value | null) => void;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
};

export function ComboBoxResponsive({
  values,
  selectedValue,
  setSelectedValue,
  placeholder = "Filter options...",
  buttonLabel = "Select values...",
  className = "",
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const TriggerButton = (
    <Button
      variant="outline"
      className={cn(
        "w-full md:min-w-[200px] flex justify-between items-center",
        className
      )}
    >
      {selectedValue ? selectedValue.label : buttonLabel}
      <ArrowDown className="h-4 w-4 ml-2" />
    </Button>
  );

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "none") {
      setSelectedValue(null);
    } else {
      const selected =
        values.find((item) => item.value === selectedValue) || null;
      setSelectedValue(selected);
    }
    setOpen(false);
  };

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ValueList
            values={values}
            onSelect={handleSelect}
            placeholder={placeholder}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{placeholder}</DrawerTitle>
          <DrawerDescription>{placeholder}</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <ValueList
            values={values}
            onSelect={handleSelect}
            placeholder={placeholder}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ValueList({
  values,
  onSelect,
  placeholder,
}: {
  values: Value[];
  onSelect: (value: string) => void;
  placeholder: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {values.map((value) => (
            <CommandItem
              className="cursor-pointer"
              key={value.value}
              value={value.value}
              onSelect={onSelect}
            >
              {value.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
