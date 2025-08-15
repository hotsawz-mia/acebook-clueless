const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);

router.get("/", tokenChecker, UsersController.getUsers);
router.get("/:userId", tokenChecker, UsersController.getUserById);

router.post("/:userId/follow", tokenChecker, UsersController.followUser);
router.delete("/:userId/follow", tokenChecker, UsersController.unfollowUser);

module.exports = router;