require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');  // Your Mongoose User model

const Post = require('../models/post');  // Your Mongoose Post model


async function seedDB() {
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear old data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️ Cleared users and posts');

    // Create users (with hashed passwords)
    const users = await User.insertMany([
        { email: 'alice@example.com', password: await bcrypt.hash('password123', 10) },
        { email: 'bob@example.com', password: await bcrypt.hash('securepass', 10) },
    ]);

    console.log('👥 Users seeded');

    // Create posts (linking to users)
    await Post.insertMany([
        { message: 'Hello world!', user: users[0]._id },
        { message: 'MERN stack is awesome!', user: users[1]._id },
    ]);

    console.log('📝 Posts seeded');

    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
    }
}

seedDB();