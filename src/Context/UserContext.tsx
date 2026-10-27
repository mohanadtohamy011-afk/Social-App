import { useEffect, useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTokenContext } from "./TokenContext";
import { getMyProfile } from "../Services/Profile.service";
import { UserContext } from "./UserContext";
import type { UserProfile } from "../types/user.type";

type ProfileState = {
  token: string | null;
  userDetails: UserProfile | null;
  error: string | null;
};

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const { token } = useTokenContext();
  const [profileState, setProfileState] = useState<ProfileState>({
    token,
    userDetails: null,
    error: null,
  });

  useEffect(() => {
    if (!token) return; 

    let isActive = true;
    getMyProfile()
      .then(({ data }) => {
        const userDetails = data.data?.user;
        if (!userDetails) {
          throw new Error("The profile response did not include user details.");
        }
        if (isActive) {
          setProfileState({ token, userDetails, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : undefined;
        const errorMessage = message ?? "Could not load your profile.";
        setProfileState({ token, userDetails: null, error: errorMessage });
        toast.error(errorMessage);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const isCurrentProfile = profileState.token === token;
  const value = {
    userDetails: isCurrentProfile ? profileState.userDetails : null,
    isLoading: Boolean(token) && (!isCurrentProfile || (!profileState.userDetails && !profileState.error)),
    error: isCurrentProfile ? profileState.error : null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
