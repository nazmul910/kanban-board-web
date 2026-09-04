import * as React from "react";
import { cn } from "../../lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold text-gray-300 tracking-wide uppercase select-none",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
