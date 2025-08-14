const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find().populate("user", "email");
  const token = generateToken(req.user_id);
  res.status(200).json({ posts, token });
}

async function createPost(req, res) {
  const post = new Post({
    message: req.body.message,
    user: req.user_id,
  });
  await post.save();

  const token = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token });
}

const PostsController = { getAllPosts, createPost };
module.exports = PostsController;