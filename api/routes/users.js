const express = require("express");
const router = express.Router();

const tokenChecker = require("../middleware/tokenChecker");
const PostsController = require("../controllers/posts");
const UsersController = require("../controllers/users");  // profile pic

const multer = require("multer");                           // profile pic
const upload = multer({ dest: "uploads/" });    // profile pic

router.post("/", UsersController.create);

router.get("/", tokenChecker, UsersController.getUsers);

// profile pic
router.put("/me", tokenChecker, upload.fields ([
        { name: "profilePicture", maxCount: 1 },
        { name: "backgroundPicture", maxCount: 1 }
    ]),
    UsersController.updateMe
);


router.post("/:userId/follow", tokenChecker, UsersController.followUser);
router.delete("/:userId/follow", tokenChecker, UsersController.unfollowUser);
router.get("/:userId/following", tokenChecker, UsersController.getFollowing);
router.get("/:userId", tokenChecker, UsersController.getUserById);

router.get("/:userId/posts", tokenChecker, PostsController.getUserPosts);

module.exports = router;