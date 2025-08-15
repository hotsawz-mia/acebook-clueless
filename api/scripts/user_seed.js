const mongoose = require("mongoose");
const { connectToDatabase } = require("./db"); // Assuming the connection is in db.js
const User = require("./models/user"); // Adjust path if needed

// Sample users to seed into the database
const users = [
  {
    name: "Alice",
    email: "alice@example.com",
    password: "password123", // Use a hashed password in production
  },
  {
    name: "Bob",
    email: "bob@example.com",
    password: "password123",
  },
  {
    name: "Charlie",
    email: "charlie@example.com",
    password: "password123",
  },
];

async function seedDB() {
  try {
    // Connect to the database
    await connectToDatabase();

    console.log("Starting to seed the database...");

    // Optional: Remove existing users if you want a clean slate
    await User.deleteMany();

    // Insert the new sample users into the database
    await User.insertMany(users);

    console.log("Successfully seeded the database with initial data!");
    process.exit(); // Exit the process once seeding is complete
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1); // Exit with an error code
  }
}

// Run the seeding function
seedDB();