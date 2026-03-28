"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "student" | null;

interface RoleContextType {
  role: UserRole;
  isStudent: boolean;
  isParent: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isStudent: false,
  isParent: false,
  isLoggedIn: false,
  userId: null,
  loading: true,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Try to get role from users table first
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "student" || profile?.role === "parent") {
        setRole(profile.role);
      } else {
        // Fall back to user_metadata
        const metaRole = user.user_metadata?.role;
        setRole(metaRole === "student" ? "student" : "parent");
      }

      setLoading(false);
    }

    fetchRole();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
      } else {
        // Re-fetch role on auth change
        fetchRole();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: RoleContextType = {
    role,
    isStudent: role === "student",
    isParent: role === "parent",
    isLoggedIn: role !== null,
    userId,
    loading,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
