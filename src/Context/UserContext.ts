import { createContext, useContext } from "react";
import type { UserProfile } from "../types/user.type";

export type UserContextValue = {
  userDetails: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

export const UserContext = createContext<UserContextValue | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
}
