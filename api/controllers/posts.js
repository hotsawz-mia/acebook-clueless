const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {


  try {
    const posts = await Post.find().populate("user", "email");

    const token = generateToken(req.user_id);

    const postsWithLikedFlag = posts.map(post => ({
      ...post.toObject(),
      likedByUser: post.likedBy.some(
        id => id.toString() === req.user_id
      )
    }));

    res.status(200).json({ posts: postsWithLikedFlag, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createPost(req, res) {
  const post = new Post({

  message: req.body.message,
  user: req.user_id, // Save the user ID
});
await post.save();

  const token = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token });
}

async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user_id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({message: "Post not found"});

    if (post.likedBy.includes(userId)) {
      return res.status(409).json({message: "You have already liked this post"});
    }
    post.likes += 1;
    post.likedBy.push(userId)
    await post.save();
    res.json({likes: post.likes});
  } catch (error) {
      return res.status(500).json({message: error.message});
  }

}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  likePost: likePost,
};

module.exports = PostsController;
