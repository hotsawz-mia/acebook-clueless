const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const path = require("path");

async function getAllPosts(req, res) {
  try {

    const posts = await Post.find().populate({ path: "user", select: "username profilePicture", match: { profilePicture: { $exists: true, $nin: [null, ""] } } }); // added on this like for the profile pic to appear in posts 

    const postsWithAvatar = posts.filter(p => p.user !== null);

    const token = generateToken(req.user_id);
    // added posts with avatar above and below for profile pic
    const postsWithLikedFlag = postsWithAvatar.map(post => ({
      ...post.toObject(),
      likedByUser: post.likedBy.some(
        id => id.toString() === req.user_id
      ),
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


async function getUserPosts(req, res) {
  try {


    const posts = await Post.find({ user: req.params.userId})
    .sort({ createdAt: -1})
    .populate("user", "username profilePicture");

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const PostsController = {
  getAllPosts,
  createPost,
  likePost,
  getComments,
  addComment,
  getUserPosts,
};

module.exports = PostsController;
