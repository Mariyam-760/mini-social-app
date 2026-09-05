import api from './api';

export const getPosts = async () => {
  const { data } = await api.get('/posts');
  return data.posts;
};

export const createPost = async ({ text, imageFile }) => {
  const formData = new FormData();
  if (text) formData.append('text', text);
  if (imageFile) formData.append('image', imageFile);

  const { data } = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.post;
};

export const toggleLike = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const addComment = async (postId, text) => {
  const { data } = await api.post(`/posts/${postId}/comment`, { text });
  return data;
};
