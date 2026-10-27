import api from "./api";

export async function getUserFeed() {
  return api.get("/posts?limit=10");
}
