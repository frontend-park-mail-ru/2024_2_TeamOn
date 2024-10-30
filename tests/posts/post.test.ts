import { calculateAmountPosts } from "../../src/utils/calculateAmountPosts";

const user: any = {
  post: [1, 2, 3],
};

test("корректный подсчет постов ", () => {
  expect(calculateAmountPosts(user.post)).toBe(user.post.length);
});
