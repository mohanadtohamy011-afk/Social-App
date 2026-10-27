import type { UserProfile } from "../types/user.type";
import api from "./api";

type ProfileResponse = {
  data: {
    user: UserProfile;
  };
};

export async function getMyProfile() {
  return api.get<ProfileResponse>("/users/profile-data");
}
