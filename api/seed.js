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
  {
    username: "EvilMorty",
    email: "evilmorty@citadel.net",
    password: "oneTrueMorty",
    profilePicture: "/uploads/EvilMorty.webp",
    backgroundPicture: "/uploads/Citadel_Council.webp",
    bio: "Just another Morty… or maybe the one pulling all the strings. Believes in breaking cycles and watching Rick squirm.",
    hobbies: ["political manipulation", "theme songs", "eye patch collection"],
  },
  {
  username: "Skeletor",
  email: "skeletor@snake-mountain.org",
  password: "bonez4life",
  profilePicture: "/uploads/Skeletor.webp",
  backgroundPicture: "/uploads/SnakeMountain.webp",
  bio: "Evil Lord of Destruction. Aspiring motivational speaker. Collector of failed plans.",
  hobbies: ["yelling at minions", "plotting badly", "laughing menacingly"]
  },
  {
  username: "Aku",
  email: "aku@shapeshifting.darkness",
  password: "samuraijackwho",
  profilePicture: "/uploads/Aku.webp",
  backgroundPicture: "/uploads/Aku_Lair.webp",
  bio: "The Shapeshifting Master of Darkness. Spreader of chaos. Eternal hater of time-traveling samurais.",
  hobbies: ["evil monologues", "destroying timelines", "dramatic laughter"]
  },
];

// Villain posts
const posts = [
  { message: "Just signed another soul contract. Easy money.", photoUrl: "/uploads/soul_contract.webp", username: "Hades"},
  { message: "I, Mojo Jojo, WILL conquer Townsville. Again. And again.", username: "MojoJojo" },
  { message: "Attempt #246 to steal the Krabby Patty formula. This time for sure!", username: "Plankton" },
  { message: "Duloc will be spotless... or else.", photoUrl: "/uploads/Duloc.webp",  username: "LordFarquaad" },
  { message: "Anyone know a good stylist for fire hair? Asking for a friend. That friend is me.", username: "Hades" },
  { message: "Mojo Jojo does NOT approve of the city's new zoning laws!", username: "MojoJojo" },
  { message: "Built a new chum-based dessert. Karen says it's 'inedible'. Rude.", username: "Plankton" },
  { message: "Auditioning knights to rescue princesses I have yet to kidnap.", photoUrl: "/uploads/audition.webp", username: "LordFarquaad" },
  { message: "Thinking about redecorating the Underworld. Maybe more lava.", username: "Hades" },
  { message: "Just another day at the Citadel. Funny how nobody notices who's really pulling the strings. 😉", photoUrl: "/uploads/rick.webp", username: "EvilMorty"},
  { message: "Curses! Another brilliant plan foiled… by children. AGAIN. 😤", photoUrl: "/uploads/SnakeMountain2.webp", username: "Skeletor"},
  { message: "One day, He-Man… ONE DAY! Until then, I shall practice my evil laugh. MWAHAHAHA!", username: "Skeletor"},
  { message: "Long ago in a distant land, I unleashed an unspeakable evil. And yet… here I am, still waiting for my five-star rating. 😈", photoUrl: "/uploads/Aku_Lair.webp", username: "Aku"},
  { message: "Why conquer ONE world when you can conquer ALL timelines? Multiversal domination just hits different. 🔥", username: "Aku"},
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
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
      { username: "Dave", following: ["Hades", "MojoJojo", "Evil Morty"], followers: ["Hades", "Skeletor"] },
      { username: "Hades", following: ["Dave", "Aku"], followers: ["Dave", "MojoJojo", "Aku"] },
      { username: "MojoJojo", following: ["Plankton", "Skeletor"], followers: ["Dave", "Evil Morty"] },
      { username: "Plankton", following: ["LordFarquaad", "Evil Morty"], followers: ["MojoJojo"] },
      { username: "LordFarquaad", following: ["Skeletor"], followers: ["Plankton", "Aku"] },
      { username: "Evil Morty", following: ["Hades", "Aku"], followers: ["Dave", "Plankton", "MojoJojo"] },
      { username: "Skeletor", following: ["Aku", "LordFarquaad"], followers: ["Dave", "MojoJojo", "Aku"] },
      { username: "Aku", following: ["Evil Morty", "Hades"], followers: ["Hades", "Skeletor", "LordFarquaad"] },
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
        photoUrl: post.photoUrl ?? null,
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