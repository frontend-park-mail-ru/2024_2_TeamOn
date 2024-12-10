import { calculateAmountPosts } from "../../src/utils/calculateAmountPosts";

const user: any = {
  post: [1, 2, 3],
};

test("корректный подсчет пост ов ", () => {
  expect(calculateAmountPosts(user.post)).toBe(user.post.length);
});
