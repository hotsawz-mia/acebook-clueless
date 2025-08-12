const Post = require("../models/post");

async function getAllPosts(req, res) {
  const posts = await Post.find();
  res.status(200).json({ posts: posts });
}

async function createPost(req, res) {
  const post = new Post(req.body);
  post.save();

  res.status(201).json({ message: "Post created" });
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
};

module.exports = PostsController;
