const express = require("express");
const PostController = require("../controllers/postsController");

const routerPost = express.Router();

routerPost
  .get("/posts/all", PostController.listarPosts)
  .get("/posts/:id", PostController.listarUmPost)
  .post("/posts/new", PostController.cadastrarPost)
  .put("/posts/edit/:id", PostController.editarPost)
  .delete("/posts/remove/:id", PostController.deletePost);

module.exports = routerPost;
