import api from "./api";

export async function getPostComments(postId: string) {
  return api.get(`/posts/${postId}/comments`);
}

export async function createPostComment(postId: string, formData: FormData) {
  return api.post(`/posts/${postId}/comments`, formData);
}

export async function updatePostComment(
  postId: string,
  commentId: string,
  formData: FormData,
) {
  return api.put(`/posts/${postId}/comments/${commentId}`, formData);
}

export async function deletePostComment(postId: string, commentId: string) {
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}
