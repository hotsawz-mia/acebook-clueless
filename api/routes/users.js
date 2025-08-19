const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");  // profile pic
const multer = require("multer");                           // profile pic

const upload = multer({ dest: "uploads/" });    // profile pic
const router = express.Router();

router.post("/", UsersController.create);

router.get("/", tokenChecker, UsersController.getUsers);

// profile pic
router.put("/me", tokenChecker, upload.single("profilePicture"), UsersController.updateMe);

router.post("/:userId/follow", tokenChecker, UsersController.followUser);
router.delete("/:userId/follow", tokenChecker, UsersController.unfollowUser);
router.get("/:userId/following", tokenChecker, UsersController.getFollowing);
router.get("/:userId", tokenChecker, UsersController.getUserById);

module.exports = router;