export type CreateUsersLikePosts = {
  type: 'LIKE' | 'DISLIKE';
  userId: number;
  postId: number;
};

export type CreateUsersLikeComments = {
  type: 'LIKE' | 'DISLIKE';
  userId: number;
  commentId: number;
};
