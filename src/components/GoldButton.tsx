"use client";

import { ReactNode } from "react";

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
}

export function GoldButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  size = "md",
  className = "",
}: GoldButtonProps) {
  const sizeClasses =
    size === "lg"
      ? "px-8 py-4 text-lg"
      : "px-6 py-3 text-base";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-body font-medium bg-gold hover:bg-gold/90 text-navy rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
}
