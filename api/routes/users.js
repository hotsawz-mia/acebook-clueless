const express = require("express");
const router = express.Router();
const tokenChecker = require("../middleware/tokenChecker");
const PostsController = require("../controllers/posts");

const UsersController = require("../controllers/users");


router.post("/", UsersController.create);

router.get("/", tokenChecker, UsersController.getUsers);
router.put("/me", tokenChecker, UsersController.updateMe);

router.post("/:userId/follow", tokenChecker, UsersController.followUser);
router.delete("/:userId/follow", tokenChecker, UsersController.unfollowUser);
router.get("/:userId/following", tokenChecker, UsersController.getFollowing);
router.get("/:userId", tokenChecker, UsersController.getUserById);

router.get("/:userId/posts", tokenChecker, PostsController.getUserPosts);

module.exports = router;