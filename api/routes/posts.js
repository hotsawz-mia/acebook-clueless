const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.put("/:id/like", PostsController.likePost);
router.post("/:id/comments", PostsController.addComment);
router.get("/:id/comments", PostsController.getComments);

module.exports = router;
