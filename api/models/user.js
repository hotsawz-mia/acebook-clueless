const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to image
  backgroundPicture: { type: String }, // URL to image
  hobbies: [{ type: String }], // Array of hobby strings
  bio: { type: String },

  // New fields for follow system
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
    default: [],
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
    default: [],
  }],

  createdAt: { type: Date, default: Date.now }
});

// const User = mongoose.model("User", UserSchema);

// module.exports = User;

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);