import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            className="peer h-4 w-4 shrink-0 opacity-0 absolute"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded border border-primary shadow peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex items-center justify-center",
              "peer-checked:bg-primary peer-checked:text-primary-foreground",
              className
            )}
          >
            <CheckIcon className="h-3 w-3 text-white peer-checked:opacity-100 opacity-0 transition-opacity" />
          </div>
        </div>
        {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };