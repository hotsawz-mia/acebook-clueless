const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const path = require("path");

async function getAllPosts(req, res) {
  try {
    // Populate user info (username or email)
    const posts = await Post.find().populate("user", "username email");

    const token = generateToken(req.user_id);

    // Add likedByUser flag and ensure photoUrl is included
    const postsWithLikedFlag = posts.map(post => ({
      ...post.toObject(),
      likedByUser: post.likedBy.some(
        id => id.toString() === req.user_id
      ),
      // photoUrl is included automatically if in schema
    }));

    res.status(200).json({ posts: postsWithLikedFlag, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createPost(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user_id;

    if (!message?.trim() && !req.file) {
      return res.status(400).json({ message: "Message or photo required" });
    }

    let photoUrl = null;
    if (req.file) {
      // Construct URL relative to /uploads
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const post = new Post({
      message: message?.trim(),
      user: userId,
      photoUrl,
      createdAt: new Date(),
      likedBy: [],
      likes: 0,
      comments: [],
    });

    await post.save();

    const token = generateToken(userId);
    res.status(201).json({ message: "Post created", token, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
}

async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user_id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likedBy.includes(userId)) {
      return res.status(409).json({ message: "You have already liked this post" });
    }
    post.likes += 1;
    post.likedBy.push(userId);
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getComments(req, res) {
  const post = await Post.findById(req.params.id).populate("comments.user", "email");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ comments: post.comments });
}

async function addComment(req, res) {
  const post = await Post.findById(req.params.id).populate("comments.user", "email");
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ user: req.user_id, text: req.body.text });
  await post.save();
  await post.populate("comments.user", "email");

  res.json({ comments: post.comments });
}

const PostsController = {
  getAllPosts,
  createPost,
  likePost,
  getComments,
  addComment,
};

module.exports = PostsController;
