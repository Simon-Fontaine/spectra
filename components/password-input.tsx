"use client";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Props = React.ComponentProps<"input"> & {
  name?: string;
};

export default function PasswordInput({
  name,
  className,
  placeholder = "••••••••",
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("relative w-full", className)}>
      <TooltipProvider delayDuration={0}>
        <Input
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10"
          {...props}
        />
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={
              showPassword ? "Password Visible" : "Password Invisible"
            }
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
          >
            {showPassword ? (
              <EyeOff className="h-[1.2rem] w-[1.2rem] cursor-pointer select-none" />
            ) : (
              <Eye className="h-[1.2rem] w-[1.2rem] cursor-pointer select-none" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {showPassword ? "Hide Password" : "Show Password"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
