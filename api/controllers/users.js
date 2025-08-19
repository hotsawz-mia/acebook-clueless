const User = require("../models/user");



function create(req, res) {
  const { email, password, username } = req.body;

  const user = new User({ email, password, username });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error("CREATE USER ERROR:", err);
      if (err?.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res
        .status(400)
        .json({
          message: err?.message || "Validation failed",
          errors: err?.errors || null
        });
    });
}

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    let targetUserId = userId;

    if (userId === "me") {
      targetUserId = req.user_id;
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// New followUser method
async function followUser(req, res) {
  try {
    const targetUserId = req.params.userId;
    const currentUserId =
      (req.user && (req.user.id || req.user._id)) ||
      req.userId ||
      req.user_id;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    if (String(targetUserId) === String(currentUserId)) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    const targetExists = await User.exists({ _id: targetUserId });
    if (!targetExists) {
      return res.status(404).json({ error: "User not found." });
    }

    const me = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: targetUserId } },
      { new: true, select: "following" }
    );

    const target = await User.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: currentUserId } },
      { new: true, select: "followers" }
    );

    return res.status(200).json({
      ok: true,
      followingCount: me.following.length,
      followersCount: target.followers.length
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function unfollowUser(req, res) {
  try {
    const targetUserId = req.params.userId;
    const currentUserId =
      (req.user && (req.user.id || req.user._id)) ||
      req.userId ||
      req.user_id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthenticated" });
    if (String(targetUserId) === String(currentUserId)) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    const targetExists = await User.exists({ _id: targetUserId });
    if (!targetExists) return res.status(404).json({ error: "User not found." });

    const me = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: targetUserId } },
      { new: true, select: "following" }
    );

    const target = await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: currentUserId } },
      { new: true, select: "followers" }
    );

    return res.status(200).json({
      ok: true,
      followingCount: me.following.length,
      followersCount: target.followers.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function updateMe(req, res) {
  try {
    const id = req.user_id; // set by tokenChecker
    const { username, bio, hobbies } = req.body;  // changed to edit profile

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return res.status(400).json({ message: "Invalid username" });
    }
    const base = (process.env.BACKEND_URL || "").replace(/\/$/, "");
       // changed to edit profile
    const updates = {};
      if (username) updates.username = username.trim();
      if (bio !== undefined) updates.bio = bio.trim();
      if (hobbies !== undefined) {
        try {
          updates.hobbies = Array.isArray(hobbies) ? hobbies : JSON.parse(hobbies);
        } catch {
          updates.hobbies = []; // fallback if bad JSON
        }
      }
      if (req.file) {
        updates.profilePicture = base
          ? `${base}/uploads/${req.file.filename}`
          : `/uploads/${req.file.filename}`;
        }
        
      const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },    // changed to edit profile

      { new: true, runValidators: true }
    ).select("_id email username bio hobbies profilePicture");

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: updated, token: res.locals.token });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: "Username already taken" });
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getFollowing(req, res) {
  try {
    const paramId = req.params.userId;
    const id = paramId === "me" ? req.user_id : paramId;

    const user = await User.findById(id)
      .populate("following", "username email profilePicture createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ users: user.following || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


const UsersController = {
  create,
  getUsers,
  getUserById,
  followUser,
  unfollowUser,
  updateMe,
  getFollowing,
};

module.exports = UsersController;