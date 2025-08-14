const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);

router.get("/", UsersController.getUsers); // Add this line
router.get("/:userId", tokenChecker, UsersController.getUserById); // Add tokenChecker middleware

module.exports = router;
