import api from "./api";

export async function getSinglePost(postId: string) {
  return api.get(`/posts/${postId}`);
}

export async function createPost(formData: FormData) {
  return api.post("/posts", formData);
}


export async function updatePost(postId: string, formData: FormData) {
  return api.put(`/posts/${postId}`, formData);
}

export async function deletePost(postId: string) {
  return api.delete(`/posts/${postId}`);
}