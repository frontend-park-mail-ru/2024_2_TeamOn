function findCommentByPostId(postID: any, comments: any) {
  return comments.find((comment: any) => comment.postID === postID);
}

export { findCommentByPostId };
