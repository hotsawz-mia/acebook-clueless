const User = require("../models/user");

// function create(req, res) {
//   console.log("CREATE USER REQ BODY:", req.body); 

//   const email = req.body.email;
//   const password = req.body.password;

//   const user = new User({ email, password });
//   user
//     .save()
//     .then((user) => {
//       console.log("User created, id:", user._id.toString());
//       res.status(201).json({ message: "OK" });
//     })
//     .catch((err) => {
//       console.error("CREATE USER ERROR:", err);
//       if (err?.code === 11000) {
//         return res.status(409).json({ message: "Email already exists" });
//       }
//       return res.status(400).json({
//         message: err?.message || "Validation failed",
//         errors: err?.errors || null,
//       });
//     });
// }


function create(req, res) {
  const { email, password, username } = req.body; // ← include username

  const user = new User({ email, password, username }); // ← pass it to the model
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
        .json({ message: err?.message || "Validation failed", errors: err?.errors || null });
    });
}


async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    let targetUserId = userId;
    
    // If userId is "me", use the current user's ID from the token
    if (userId === "me") {
      targetUserId = req.user_id;
    }
    
    const user = await User.findById(targetUserId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

const UsersController = {
  create: create,
  getUsers: getUsers,
  getUserById: getUserById,
};

module.exports = UsersController;
