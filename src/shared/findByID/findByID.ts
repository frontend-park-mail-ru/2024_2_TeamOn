function findCommentById(commentID: any, comments: any) {
  return comments.find((comment: any) => comment.commentID === commentID);
}

export { findCommentById };
