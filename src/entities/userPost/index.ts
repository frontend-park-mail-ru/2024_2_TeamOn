import { renderUserPost, renderDeletePost } from "./ui/ui";
import { renderCreatePost } from "../../pages/addPost/index";
import { renderUpdatePost } from "../../pages/updatePost/index";
import { deletePost, editPost, addUserPost } from "./api/api";

export {
  renderUserPost,
  renderUpdatePost,
  renderDeletePost,
  renderCreatePost,
  deletePost,
  editPost,
  addUserPost,
};
