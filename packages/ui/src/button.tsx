import type { ComponentProps } from "react";

export function Button({
  className = "",
  variant = "quiet",
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: "quiet" | "accent" }) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      {...props}
    />
  );
}
