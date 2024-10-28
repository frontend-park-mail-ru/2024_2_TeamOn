function calculateAmountPosts(posts: any) {
  if (posts.length < 0) {
    throw new Error("Количество постов не может быть отрицательным!");
  }
  return posts.length;
}

export { calculateAmountPosts };
