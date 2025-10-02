
// src/lib/apiUrls.ts

const API_BASE_URL = "/api/v1";

export const apiUrls = {
  // Roles
  getRoles: `${API_BASE_URL}/roles`,
  getRoleById: (roleId: string) => `${API_BASE_URL}/roles/${roleId}`,

  // Users
  getUsers: `${API_BASE_URL}/users`,
  getUserById: (userId: string) => `${API_BASE_URL}/users/${userId}`,

  // Blogs
  getBlogs: `${API_BASE_URL}/blogs`,
  getBlogById: (blogId: string) => `${API_BASE_URL}/blogs/${blogId}`,

  // Comments
  getCommentsForBlog: (blogId: string) => `${API_BASE_URL}/blogs/${blogId}/comments`,
  getCommentById: (commentId: string) => `${API_BASE_URL}/comments/${commentId}`,
  getCommentsByBlogId: (blogId: string) => `${API_BASE_URL}/comments/${blogId}`,

};
