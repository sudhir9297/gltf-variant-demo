import { useState } from "react";

export function Collapsible({ defaultOpen = false, className = "", children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className} data-open={open}>
      {typeof children === "function" ? children({ open, setOpen }) : children}
    </div>
  );
}

export function CollapsibleTrigger({
  children,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`w-full text-left ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  open,
  children,
  className = "",
  ...props
}) {
  if (!open) return null;
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
