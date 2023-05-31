export type CreateUsersLikePosts = {
  type: 'LIKE' | 'DISLIKE';
  userId: number;
  postId: number;
};
