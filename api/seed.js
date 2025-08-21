const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user");
const Post = require("./models/post"); // adjust path if needed

// Villain users
const users = [
    {
    username: "Dave",
    email: "dave@dave.com",
    password: "dave",
    profilePicture: "/uploads/dave.webp",
    backgroundPicture: "/uploads/Dave_Fam.jpeg",
    bio: "Just a dude who stumbled into destiny by accident. When he’s not perfecting sourdough, he’s mastering the art of staring contests with drying paint or adding yet another thimble to his oddly prestigious collection. A man of unusual hobbies, but impeccable timing.",
    hobbies: ["Baking", "Watching paint dry", "Collecting thimbles"],
    following: [],
    followers: []
  },
  {
    username: "Hades",
    email: "hades@underworld.com",
    password: "flames4hair",
    profilePicture: "/uploads/Hades.webp",
    backgroundPicture: "/uploads/Hades_Lair.webp",
    bio: "God of the Underworld. Fluent in sarcasm and contract law.",
    hobbies: ["souls bargaining", "flame styling", "monologuing"],
  },
  {
    username: "MojoJojo",
    email: "mojo.jojo@jojoschemes.net",
    password: "monkeybusiness",
    profilePicture: "/uploads/Mojojojo.webp",
    backgroundPicture: "/uploads/Mojojojo_Lair.webp",
    bio: "Simian super-genius bent on ruling Townsville, with impeccable repetition skills.",
    hobbies: ["world domination", "long speeches", "gadget tinkering"],
  },
  {
    username: "Plankton",
    email: "plankton@chumbucket.biz",
    password: "secretformula",
    profilePicture: "/uploads/Plankton.webp",
    backgroundPicture: "/uploads/Plankton_Lair.webp",
    bio: "1% evil, 99% hot gas. Proprietor of the Chum Bucket.",
    hobbies: ["recipe theft", "robot building", "petting Karen"],
  },
  {
    username: "LordFarquaad",
    email: "farquaad@duloc.gov",
    password: "shortking",
    profilePicture: "/uploads/LordFarquaad.webp",
    backgroundPicture: "/uploads/LordFaquaad_Lair.webp",
    bio: "Ruler of Duloc. Loves order, hates ogres.",
    hobbies: ["castle tours", "lawn grooming", "overcompensating"],
  },
];

// Villain posts
const posts = [
  { message: "Just signed another soul contract. Easy money.", username: "Hades" },
  { message: "I, Mojo Jojo, WILL conquer Townsville. Again. And again.", username: "MojoJojo" },
  { message: "Attempt #246 to steal the Krabby Patty formula. This time for sure!", username: "Plankton" },
  { message: "Duloc will be spotless... or else.", username: "LordFarquaad" },
  { message: "Anyone know a good stylist for fire hair? Asking for a friend. That friend is me.", username: "Hades" },
  { message: "Mojo Jojo does NOT approve of the city's new zoning laws!", username: "MojoJojo" },
  { message: "Built a new chum-based dessert. Karen says it's 'inedible'. Rude.", username: "Plankton" },
  { message: "Auditioning knights to rescue princesses I have yet to kidnap.", username: "LordFarquaad" },
  { message: "Thinking about redecorating the Underworld. Maybe more lava.", username: "Hades" },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Clear old data (dev only)
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Old users and posts removed");

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Villain users seeded");

    const userMap = {};
    createdUsers.forEach(u => { userMap[u.username] = u._id; });

    // Define relationships (by username)
    const relationships = [
      { username: "Dave", following: ["Hades", "MojoJojo"], followers: ["Hades"] },
      { username: "Hades", following: ["Dave"], followers: ["Dave", "MojoJojo"] },
      { username: "MojoJojo", following: ["Plankton"], followers: ["Dave"] },
      { username: "Plankton", following: ["LordFarquaad"], followers: ["MojoJojo"] },
      { username: "LordFarquaad", following: [], followers: ["Plankton"] },
    ];

    // Update each user with correct references
    for (const rel of relationships) {
      await User.updateOne(
        { username: rel.username },
        {
          $set: {
            following: rel.following.map(name => userMap[name]),
            followers: rel.followers.map(name => userMap[name]),
          }
        }
      );
    }

    // Create posts linked to the right user IDs
    const postDocs = posts.map((post) => {
      const author = createdUsers.find((u) => u.username === post.username);
      return {
        message: post.message,
        user: author._id,
      };
    });

    await Post.insertMany(postDocs);
    console.log("Villain posts seeded");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDB();