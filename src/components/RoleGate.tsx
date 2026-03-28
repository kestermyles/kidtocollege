"use client";

import { ReactNode } from "react";
import { useRole } from "@/lib/role-context";

interface RoleGateProps {
  parentContent: ReactNode;
  studentContent: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({
  parentContent,
  studentContent,
  fallback,
}: RoleGateProps) {
  const { role, loading } = useRole();

  if (loading) return null;

  if (role === "student") return <>{studentContent}</>;
  if (role === "parent") return <>{parentContent}</>;

  // Not logged in
  return <>{fallback ?? parentContent}</>;
}
