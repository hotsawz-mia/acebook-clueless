const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const PostsController = require("../controllers/posts");

// Multer setup for storing uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", PostsController.getAllPosts);

// Updated POST route with multer middleware to handle 'photo' file upload
router.post("/", upload.single("photo"), PostsController.createPost);

router.put("/:id/like", PostsController.likePost);
router.post("/:id/comments", PostsController.addComment);
router.get("/:id/comments", PostsController.getComments);

module.exports = router;
