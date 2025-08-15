const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user"); // adjust path if needed

// Sample users
const users = [
  {
    username: "Hades",
    email: "hades@underworld.com",
    password: "flames4hair", 
    bio: "God of the Underworld. Fluent in sarcasm and contract law.",
    hobbies: ["souls bargaining", "flame styling", "monologuing"],
  },
  {
    username: "MojoJojo",
    email: "mojo.jojo@jojoschemes.net",
    password: "monkeybusiness",
    bio: "Simian super-genius bent on ruling Townsville, with impeccable repetition skills.",
    hobbies: ["world domination", "long speeches", "gadget tinkering"],
  },
  {
    username: "Plankton",
    email: "plankton@chumbucket.biz",
    password: "secretformula",
    bio: "1% evil, 99% hot gas. Proprietor of the Chum Bucket.",
    hobbies: ["recipe theft", "robot building", "petting Karen"],
  },
  {
    username: "LordFarquaad",
    email: "farquaad@duloc.gov",
    password: "shortking",
    bio: "Ruler of Duloc. Loves order, hates ogres.",
    hobbies: ["castle tours", "lawn grooming", "overcompensating"],
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Clear old users (only do this in dev!)
    await User.deleteMany({});
    console.log("Old users removed");

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(hashedUsers);
    console.log("Database seeded successfully!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}


seedDB();