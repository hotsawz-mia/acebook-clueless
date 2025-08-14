const Post = require("../models/post");

async function getAllPosts(req, res) {
  const posts = await Post.find();
  res.status(200).json({
    posts: posts,
    token: res.locals.token, // ← include refreshed token
  });
}

async function createPost(req, res) {
  const post = new Post(req.body);
  await post.save();

  res.status(201).json({
    message: "Post created",
    token: res.locals.token, // ← include refreshed token
  });
}

const PostsController = {
  getAllPosts,
  createPost,
};

module.exports = PostsController;